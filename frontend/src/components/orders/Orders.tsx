import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders, cancelOrder } from '../../store/slices/orderSlice';
import type { Order, OrderItem } from '../../store/slices/orderSlice';
import styles from '../../styles/Orders.module.scss';
import { useNavigate } from 'react-router-dom';

const statusClass = (status: string) => {
  switch (status) {
    case 'pending': return styles.status + ' ' + styles.pending;
    case 'processing': return styles.status + ' ' + styles.assembling;
    case 'completed': return styles.status + ' ' + styles.assembled;
    case 'cancelled': return styles.status + ' ' + styles.cancelled;
    default: return styles.status;
  }
};

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.order);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.ordersContainer}>
        <h2 className={styles.ordersTitle}>У вас пока нет заказов</h2>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <h1 className={styles.ordersTitle}>Мои заказы</h1>
      {orders.map((order: Order) => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div>
              <div className={styles.orderNumber}>Заказ №{order._id}</div>
              <div className={styles.orderDate}>от {new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <span className={statusClass(order.status)}>
              {order.status === 'unconfirmed' && 'Не подтвержден'}
              {order.status === 'assembling' && 'Сборка'}
              {order.status === 'ready' && 'Готов к выдаче'}
              {order.status === 'issued' && 'Выдан'}
              {order.status === 'cancelled' && 'Отменен'}
            </span>
          </div>
          <div className={styles.orderItems}>
            {order.items.map((item: OrderItem, idx) => (
              <div key={item._id || idx} className={styles.orderItem}>
                {item.product === null ? (
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className={styles.notAvailable} style={{color:'#e53935',fontSize:'0.95em',marginTop:0,minWidth:180}}>
                      Товар отсутствует в продаже
                    </span>
                    <span className={styles.itemName} style={{color:'#e53935',fontWeight:600}}>
                      {item.name || 'Без названия'}
                    </span>
                    <span className={styles.itemQty} style={{color:'#e53935'}}>x{item.quantity || 1}</span>
                    <span className={styles.itemTotal} style={{color:'#e53935'}}>
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)} ₽
                    </span>
                  </div>
                ) :
                (!item.image || item.image === '/no-image.webp' ? (
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className={styles.notAvailable} style={{color:'#e53935',fontSize:'0.95em',marginTop:0,minWidth:180}}>
                      Товар отсутствует в продаже
                    </span>
                    <span className={styles.itemName} style={{color:'#e53935',fontWeight:600}}>
                      {item.name || 'Без названия'}
                    </span>
                    <span className={styles.itemQty} style={{color:'#e53935'}}>x{item.quantity || 1}</span>
                    <span className={styles.itemTotal} style={{color:'#e53935'}}>
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)} ₽
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.image}
                      alt={item.name || 'Товар'}
                      className={styles.itemImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className={styles.itemName} title={item.name || 'Товар'}>
                      {item.name || 'Товар'}
                    </div>
                    <div className={styles.itemQty}>x{item.quantity || 1}</div>
                    <div className={styles.itemTotal}>
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)} ₽
                    </div>
                  </>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.orderFooter}>
            <div className={styles.orderSum}>Сумма: {(order.totalAmount || 0).toFixed(2)} ₽</div>
            {(order.status !== 'issued' && order.status !== 'cancelled') && (
              <button className={styles.cancelBtn} onClick={async () => {
                await dispatch(cancelOrder(order._id));
                dispatch(fetchOrders());
              }}>
                Отменить
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders; 