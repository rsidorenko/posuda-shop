import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';
import { RootState } from '../../store/types';
import { Product } from '../../store/slices/productSlice';
import styles from '../../styles/Cart.module.scss';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const removeTimers = useRef<{ [id: string]: NodeJS.Timeout }>({});
  const [pendingRemoveIds, setPendingRemoveIds] = useState<string[]>([]);
  const [removeCountdown, setRemoveCountdown] = useState<{ [id: string]: number }>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const products = useAppSelector((state: RootState) => state.products.products);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    if (newQuantity === 0) {
      if (removeTimers.current[id]) clearTimeout(removeTimers.current[id]);
      setPendingRemoveIds((prev) => [...prev, id]);
      setRemoveCountdown((prev) => ({ ...prev, [id]: 5 }));
      removeTimers.current[id] = setInterval(() => {
        setRemoveCountdown((prev) => {
          const next = { ...prev };
          if (next[id] > 1) {
            next[id] = next[id] - 1;
          } else {
            clearInterval(removeTimers.current[id]);
            dispatch(removeFromCart(id));
            delete removeTimers.current[id];
            setPendingRemoveIds((prev) => prev.filter(_id => _id !== id));
            delete next[id];
          }
          return next;
        });
      }, 1000);
    } else if (removeTimers.current[id]) {
      clearInterval(removeTimers.current[id]);
      delete removeTimers.current[id];
      setPendingRemoveIds((prev) => prev.filter(_id => _id !== id));
      setRemoveCountdown((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (items.length === 0) {
      setOrderError('Корзина пуста');
      return;
    }

    try {
      setOrderError(null);
      if (!lastName.trim() || !firstName.trim() || !middleName.trim()) {
        setOrderError('Пожалуйста, заполните ФИО получателя');
        return;
      }
      const orderItems = items
        .filter(item => item.quantity > 0)
        .map(item => ({
          product: item._id,
          quantity: item.quantity
        }));
      const orderData = { items: orderItems, recipient: { lastName, firstName, middleName } };
      const result = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearCart());
        if (!user || user.role !== 'admin') {
          navigate('/orders');
        }
      } else if (result.payload && typeof result.payload === 'string') {
        setOrderError(result.payload);
      } else if ((result as any).error && (result as any).error.message) {
        setOrderError((result as any).error.message);
      } else {
        setOrderError('Ошибка оформления заказа');
      }
    } catch (error: any) {
      setOrderError(error?.response?.data?.message || 'Ошибка оформления заказа');
      console.error('Error creating order:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>Ваша корзина пуста</h2>
        <button className={styles.checkoutBtn} onClick={() => navigate('/catalog')}>
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Корзина</h1>
      <div className={styles.cartList}>
        {items.filter(item => item.quantity > 0).map((item) => {
          const product = products.find((p: Product) => p._id === item._id);
          const maxStock = product ? product.stock : item.stock;
          return (
            <div key={item._id} className={`${styles.cartItem} ${pendingRemoveIds.includes(item._id) ? styles.pendingRemove : ''}`}>
              <div className={styles.imageWrapper}>
                <img src={(product && product.images && product.images[0]) || item.image || '/no-image.png'} alt={item.name} className={styles.itemImage} />
                {pendingRemoveIds.includes(item._id) && removeCountdown[item._id] && (
                  <div className={styles.timerOverlay}>
                    <svg className={styles.timerSvg} width="36" height="36">
                      <circle
                        className={styles.timerCircleBg}
                        cx="18" cy="18" r="15" strokeWidth="5" fill="none"
                      />
                      <circle
                        className={styles.timerCircle}
                        cx="18" cy="18" r="15" strokeWidth="5" fill="none"
                        strokeDasharray={2 * Math.PI * 15}
                        strokeDashoffset={(2 * Math.PI * 15) * (1 - removeCountdown[item._id] / 5)}
                      />
                    </svg>
                    <span className={styles.timerText}>{removeCountdown[item._id]}</span>
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName} title={item.name}>{item.name}</div>
                <div className={styles.itemPrice}>Цена: {item.price.toFixed(2)} ₽</div>
              </div>
              <div className={styles.counterRow}>
                <div className={styles.counter}>
                  <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} disabled={item.quantity === 0}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} disabled={item.quantity >= maxStock}>+</button>
                </div>
                <div className={styles.stockInfo}>В наличии: {maxStock}</div>
              </div>
              <div className={styles.itemTotal}>{(item.price * item.quantity).toFixed(2)} ₽</div>
              <button className={styles.removeBtn} onClick={() => handleRemoveItem(item._id)}>
                Удалить
              </button>
            </div>
          );
        })}
      </div>
      <div className={styles.summary}>
        {orderError && <div className={styles.orderError}>{orderError}</div>}
        <div className={styles.recipientFields}>
          <input
            type="text"
            placeholder="Фамилия получателя"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className={styles.recipientInput}
            required
          />
          <input
            type="text"
            placeholder="Имя получателя"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className={styles.recipientInput}
            required
          />
          <input
            type="text"
            placeholder="Отчество получателя"
            value={middleName}
            onChange={e => setMiddleName(e.target.value)}
            className={styles.recipientInput}
            required
          />
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Итого:</span>
          <span className={styles.summaryTotal}>{total.toFixed(2)} ₽</span>
        </div>
        <button
          className={styles.checkoutBtn}
          onClick={handleCreateOrder}
          disabled={!lastName.trim() || !firstName.trim() || !middleName.trim()}
        >
          {isAuthenticated ? 'Оформить заказ' : 'Войти для оформления'}
        </button>
      </div>
    </div>
  );
};

export default Cart; 