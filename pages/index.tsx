// const home: Component = () =>{
//     const [ count, setCount ] = createSignal( 0 );

//     return (
//       <div class="App">
//         <div class="grid grid-cols-2 gap-4  object-center">
//           <div class=" object-center">
//             <img src="https://raw.githubusercontent.com/bun-community/create-templates/611c0efd5b31ced1b2f4760a1e119d824c258626/react-ssr/public/bunlogo.svg" alt="Image 1" class="logo" />
//           </div>
//           <div>
//             <img src="./logo.svg" alt="Image 2" class=" content-stretch logo solid" />
//           </div>
//         </div>
//         <h1>Bun + Solid</h1>
//         <div class="card">
//             <p> check pages/index.tsx and notice there are no import statements!</p>
//             <Counter/>    
//         </div>
//         <p class="read-the-docs">
//           Click on the bun and Solid logos to learn more
//         </p>
//       </div>
//     );
// };

// export default home

{/* <div class=" flex">
          <div class=" flex-1">
          <a href="https://bun.sh" target="_blank">
            <img src="https://raw.githubusercontent.com/bun-community/create-templates/611c0efd5b31ced1b2f4760a1e119d824c258626/react-ssr/public/bunlogo.svg" class="logo" alt="Bun logo" />
          </a>
          </div>
          <div class=" flex-1">
          <a href="https://www.solidjs.com" target="_blank">
            <img src="https://repository-images.githubusercontent.com/130884470/ad63fd00-7ab2-11ea-9c57-6c114391183a"  class="logo solid" alt="Solid logo" />
          </a>
          </div>
        </div> */}

import { createSignal } from 'solid-js';
import solidLogo from '../assets/logo.svg';

// import './App.css';

function App () {
  const [ count, setCount ] = createSignal( 0 );


          return (
            <div class="App">
              <div>one</div>
              <div class=' flex border border-x-rose-200'>
                <a href="https://bun.sh" target="_blank">
                  <img src="./bunlogo.svg" class="logo" alt="Bun logo" />
                </a>
                <a href="https://www.solidjs.com" target="_blank">
                  <img src={ solidLogo } class="logo solid w-72" alt="Solid logo" />
                </a>
              </div>
              <h1>Vite + Solid</h1>
              <div class="card">
                <button onClick={ () => setCount( ( count ) => count + 1 ) }>
                  count is { count() }
                </button>
                <p>
                  Edit <code>pages/index.tsx</code>
                </p>
              </div>
              <p class="read-the-docs">
                Click on the Vite and Solid logos to learn more
              </p>
            </div>
          );
}

export default App;