import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/ProductDetail.module.scss';
import CatalogModule from '../../styles/Catalog.module.scss';
import { addToCart, updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/types';
import { Product, fetchProducts } from '../../store/slices/productSlice';
import { CartItem } from '../../store/slices/cartSlice';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // TODO: вынести в .env для продакшена

function getImageUrl(img: string) {
  if (!img) return '/no-image.png';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/uploads/')) return img;
  return `/uploads/${img}`;
}

// Helper function to find similar products - Defined outside the component
const findSimilarProducts = (localProduct: Product | null, products: Product[]) => {
  if (!localProduct || !products.length) return [];

  return products.filter((p: Product) => p.category === localProduct.category && p._id !== localProduct._id).slice(0, 4);
};

// Helper function for similar product click handler - Defined outside the component
const handleSimilarProductClick = (rel: Product, navigate: ReturnType<typeof useNavigate>) => {
  navigate(`/catalog/${rel._id}`);
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find((item: CartItem) => item._id === String(id));
  const productsState = useAppSelector((state: RootState) => state.products);
  const [mainImg, setMainImg] = React.useState<string>('');
  const [localProduct, setLocalProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    if (!productsState.products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsState.products.length]);

  React.useEffect(() => {
    if (localProduct && localProduct.images && localProduct.images[0]) {
      setMainImg(localProduct.images[0]);
    }
  }, [localProduct]);

  React.useEffect(() => {
    // Fetch product details when the ID changes
    setLocalProduct(null); // Clear previous product data
    // TODO: Optionally set a local loading state here

    if (id) { // Only fetch if id is available
      axios.get(`${API_URL}/api/products/${id}`)
        .then(res => {
          setLocalProduct(res.data);
          // TODO: Optionally set local loading state to false
        })
        .catch(() => {
          setLocalProduct(null);
          // TODO: Optionally set local loading state to false and show error
        });
    } else {
      // Handle case where id is not available (e.g., redirect or show error)
      setLocalProduct(null); // Ensure product is null if id is missing
    }

    // Cleanup function if needed (e.g., to cancel the axios request on component unmount or id change)
    // For example, return () => { cancelToken.cancel(); }; if using cancellable requests
  }, [id]); // Depend only on the 'id' parameter

  const productToShow = localProduct || productsState.products.find(
    (p: Product) => String(p._id) === String(id)
  );

  if (productsState.loading) {
    return <div className={styles.loaderWrapper}><div className={styles.loader}></div></div>;
  }

  if (!productToShow) {
    return <div className={styles.notFound}>Товар не найден</div>;
  }
  // Use the helper function to find related products
  const related: Product[] = findSimilarProducts(localProduct, productsState.products);

  // Вместо mainImg по умолчанию всегда используем product.images[0], если mainImg не выбран
  const displayedImg = mainImg || (productToShow.images && productToShow.images[0]) || '';

  // Функция для fallback на no-image.png
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.src.endsWith('/no-image.png')) {
      img.src = '/no-image.png';
    }
  };

  return (
    <div className={styles.detailPage}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 24,
          padding: '8px 20px',
          borderRadius: 8,
          border: 'none',
          background: '#1976d2',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
        }}
      >
        ← Назад
      </button>
      <div className={styles.topSection}>
        <div className={styles.images}>
          <img
            src={displayedImg ? getImageUrl(displayedImg) : '/no-image.png'}
            alt={productToShow?.name}
            className={styles.mainImg}
            onError={handleImgError}
          />
          <div className={styles.thumbRow} style={{overflowX: productToShow.images && productToShow.images.length > 4 ? 'auto' : 'visible', maxWidth: 340}}>
            {productToShow?.images && productToShow.images.length > 0 ? (
              productToShow.images.map((img: string, idx: number) => (
                <img
                  key={img}
                  src={getImageUrl(img)}
                  alt={productToShow.name + '-' + idx}
                  className={styles.thumb + (displayedImg === img ? ' ' + styles.active : '')}
                  onClick={() => setMainImg(img)}
                  onError={handleImgError}
                  style={{ border: displayedImg === img ? '2px solid #1976d2' : '2px solid transparent', cursor: 'pointer' }}
                />
              ))
            ) : (
              <img
                src={'/no-image.png'}
                alt={'Нет изображения'}
                className={styles.thumb}
                style={{ border: '2px solid #eee', cursor: 'default' }}
              />
            )}
          </div>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.name}>{productToShow.name}</div>
          <div className={styles.price}>{productToShow.price} ₽</div>
          <div className={styles.stock}>В наличии: {productToShow.stock}</div>
          <div className={styles.desc}>{productToShow.description}</div>
          {cartItem && cartItem.quantity > 0 ? (
            <div className={`${CatalogModule.qtyControl} ${styles.detailQtyControl}`}>
              <button className={CatalogModule.qtyBtn} onClick={e => {
                e.stopPropagation();
                if (cartItem.quantity > 1) dispatch(updateQuantity({ id: String(productToShow._id), quantity: cartItem.quantity - 1 }));
                else dispatch(removeFromCart(String(productToShow._id)));
              }}>-</button>
              <span className={CatalogModule.qtyValue}>{cartItem.quantity}</span>
              <button className={CatalogModule.qtyBtn} onClick={e => {
                e.stopPropagation();
                if (cartItem.quantity < productToShow.stock) {
                  dispatch(updateQuantity({ id: String(productToShow._id), quantity: cartItem.quantity + 1 }));
                }
              }}
              disabled={cartItem.quantity >= productToShow.stock}>+</button>
            </div>
          ) : (
            <button 
              className={`${CatalogModule.addBtn} ${productToShow.stock === 0 ? CatalogModule.outOfStock : ''}`} 
              onClick={() => dispatch(addToCart({ product: { ...productToShow, _id: String(productToShow._id), quantity: 1, image: productToShow.images?.[0] || '' }, quantity: 1 }))}
              disabled={productToShow.stock === 0}
            >
              {productToShow.stock === 0 ? 'Нет в наличии' : 'В корзину'}
            </button>
          )}
        </div>
      </div>
      <div className={styles.relatedTitle}>Похожие товары из категории</div>
      <div className={styles.relatedRow}>
        {related.length === 0 && <div>Нет похожих товаров в этой категории.</div>}
        {related.map((rel: Product) => (
          <CatalogProductCard key={rel._id} product={rel} onCardClick={() => handleSimilarProductClick(rel, navigate)} />
        ))}
      </div>
    </div>
  );
};

// Карточка товара из каталога - Defined outside the main component
const CatalogProductCard: React.FC<{product: Product, onCardClick?: () => void}> = ({ product, onCardClick }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find((item: CartItem) => item._id === String(product._id));
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product: { ...product, _id: String(product._id), quantity: 1, image: product.images?.[0] || '' }, quantity: 1 }));
  };
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) dispatch(updateQuantity({ id: String(product._id), quantity: cartItem.quantity + 1 }));
  };
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) dispatch(updateQuantity({ id: String(product._id), quantity: cartItem.quantity - 1 }));
      else dispatch(removeFromCart(String(product._id)));
    }
  };
  return (
    <div className={CatalogModule.card} onClick={onCardClick} style={{ cursor: 'pointer' }}>
      <img src={getImageUrl(product.images && product.images[0] ? product.images[0] : '')} alt={product.name} className={CatalogModule.image} />
      <div className={CatalogModule.info}>
        <div className={CatalogModule.name}>{product.name}</div>
        <div className={CatalogModule.price}>{product.price} ₽</div>
        <div className={CatalogModule.cardFooter}>
          {cartItem ? (
            <div className={CatalogModule.qtyControl} onClick={e => e.stopPropagation()}>
              <button className={CatalogModule.qtyBtn} onClick={handleDecrement}>-</button>
              <span className={CatalogModule.qtyValue}>{cartItem.quantity}</span>
              <button className={CatalogModule.qtyBtn} onClick={handleIncrement}>+</button>
            </div>
          ) : (
            <button 
              className={`${CatalogModule.addBtn} ${product.stock === 0 ? CatalogModule.outOfStock : ''}`} 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 