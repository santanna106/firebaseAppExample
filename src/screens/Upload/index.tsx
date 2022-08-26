import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');
  const [bytesTransferidos, setBytesTransferidos] = useState('');
  const [progress, setProgress] = useState('0');
  

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  async function handleUpload(){
    const fileName = new Date().getTime();
    const MIME = image.match(/\.(?:.(?!\.))+$/);
    const reference = storage().ref(`/images/${fileName}${MIME}`);

    

    if (image === ''){
      Alert.alert('Nenuma imagem foi selecionada!')
    } else {
      const uploadTask = reference.putFile(image);
      uploadTask.on('state_changed',taskSpashot => {
        const percent = ((taskSpashot.bytesTransferred / taskSpashot.totalBytes) * 100).toFixed(0);
        setProgress(percent);
        setBytesTransferidos(`${taskSpashot.bytesTransferred} transferido de ${taskSpashot.totalBytes}`)
      });

      uploadTask.then(() => Alert.alert('Upload concluído com sucesso'));
      
     
    }

    
  }

  return (
    <Container>
      <Header title="Upload de Fotos" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={handleUpload}
        />

        <Progress>
          {progress}%
        </Progress>

        <Transferred>
          {bytesTransferidos}
        </Transferred>
      </Content>
    </Container>
  );
}
