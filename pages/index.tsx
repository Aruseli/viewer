import Button from '@material-ui/core/Button'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Viewer } from '../imports/viewer'

import stepik from '../public/stepik.jpeg'; 
import flury from '../public/flury.jpeg'; 
import gunter from '../public/gunter.jpg'; 

const slides = [
  {
    id: 1,
    src: stepik,
    alt: 'Affectionate Stepanida',
  },
  {
    id: 2,
    src: flury,
    alt: 'Wild beast Flury',
  },
  {
    id: 2,
    src: gunter,
    alt: 'Languid Gunther',
  }
];

const Home: NextPage = () => {
  const [openImage, setOpenImage] = useState<any>();

  return (<>
    <Button variant='outlined' size='large' onClick={() => setOpenImage(true)}></Button>
    <Viewer
      open={openImage}
      onClose={() => setOpenImage(false)}
      slides = {slides.map((img, i) => ({
        id: i,
        el: <div style={{position: 'relative', width: '100vw', height: '100vh'}}> 
          <Image
            src={img.src}
            alt={img.alt}
            width={400}
            height={400}
            onClick={() => setOpenImage(i)}
          />
        </div>,
      }))}
      index={openImage}
      onChangeIndex={setOpenImage}
    />
  </>)
}

export default Home
