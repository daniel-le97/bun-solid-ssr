const home: Component = () =>{
    const [ count, setCount ] = createSignal( 0 );

    return (
      <div class="App">
        <div>
          <a href="https://bun.sh" target="_blank">
            <img src="https://raw.githubusercontent.com/bun-community/create-templates/611c0efd5b31ced1b2f4760a1e119d824c258626/react-ssr/public/bunlogo.svg" height={50} width={100} class="logo" alt="Vite logo" />
          </a>
          <a href="https://www.solidjs.com" target="_blank">
            <img src="https://repository-images.githubusercontent.com/130884470/ad63fd00-7ab2-11ea-9c57-6c114391183a" height={50} class="logo solid" alt="Solid logo" />
          </a>
        </div>
        <h1>Bun + Solid</h1>
        <div class="card">
            <p> check pages/index.tsx and notice there are no import statements!</p>
            <Counter/>    
        </div>
        <p class="read-the-docs">
          Click on the bun and Solid logos to learn more
        </p>
      </div>
    );
};

export default home



