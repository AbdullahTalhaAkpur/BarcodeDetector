import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import axios from 'axios';


function App() {
  const video = useRef(null);
  const [barcode, setBarcode] = useState(null);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://barcodes1.p.rapidapi.com/',
      params: {
        query: '<REQUIRED>'
      },
      headers: {
        'X-RapidAPI-Key': '77650dc973msh98637f490a16c9dp1f9910jsn92f4c3f00c0f',
        'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (video.current) {
        video.current.srcObject = stream;
      }
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: video.current,
          constraints: {
            width: 1280,
            height: 720,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_93_reader", "upc_reader"],
        },
      }, function (err) {
        if (err) {
          console.error('Quagga başlatma hatası:', err);
          return;
        }
        Quagga.start();
        Quagga.onDetected((data) => {
          setBarcode(data.codeResult.code);
          Quagga.stop();
        });
      });
    } catch (error) {
      console.error('Kamera erişim hatası:', error);
    }
  };

  useEffect(() => {
    let isVideoAvailable = false;

    const startCameraAndListen = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (video.current) {
          video.current.srcObject = stream;
          isVideoAvailable = true;
        }
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: video.current,
            constraints: {
              width: 1280,
              height: 720,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_93_reader", "upc_reader"],
          },
        }, function (err) {
          if (err) {
            console.error('Quagga başlatma hatası:', err);
            return;
          }
          Quagga.start();
          Quagga.onDetected((data) => {
            setBarcode(data.codeResult.code);
            Quagga.stop();
          });
        });
      } catch (error) {
        console.error('Kamera erişim hatası:', error);
      }
    };

    return () => {
      if (isVideoAvailable) {
        Quagga.stop();
      }
    };
  }, []);

  return (
    <>
      <button onClick={startCamera}>Kamerayı Aç</button>
      <div>
        <video ref={video} autoPlay playsInline />
      </div>
      {barcode && (
        <div>
          Bulunan barkod: {barcode}
        </div>
      )}
    </>
  );
}

export default App;
