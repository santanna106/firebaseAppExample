import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

import { shoppingListExample } from '../../utils/shopping.list.data';

export function ShoppingList() {
  const [products, setProducts] = useState<ProductProps[]>([]);

/* Traz a coleção inteira observada */
useEffect(() => {
  const subscribe = firestore()
  .collection('products')
  .orderBy('quantity')
  .startAt(1)
  //.startAter(1) Pegar depois do 1
  //.endBefore(5) Pegar antes do 5
  .endAt(2)
  //.orderBy('description','desc') //ordenação descendendente
  //.limit(3) Limita o número de registros
  .onSnapshot(querySnapshot => {
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) as ProductProps[];
    setProducts(data)
  });

  return () => subscribe();
},[])


/* Traz a coleção filtrada observada
useEffect(() => {
  const subscribe = firestore()
  .collection('products')
  .where('quantity','>',2) //filtro
  .onSnapshot(querySnapshot => {
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) as ProductProps[];
    setProducts(data)
  });

  return () => subscribe();
},[])

 */
  /* Traz a coleção inteira sem observar o banco
  useEffect(() => {
    firestore()
    .collection('products')
    
    .get()
    .then(response => {
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[];
      setProducts(data);

    })
    .catch(error => console.error(error));
  },[])
  */
  /* Trazendo apenas um documento
  useEffect(() => {
    firestore()
    .collection('products')
    .doc('Numero ID')
    .get()
    .then(response => console.log({
      id:response.id,
      ...response.data()
    }))
    .catch(error => console.error(error));
  },[])
  */
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Product data={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
