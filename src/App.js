import './App.css';

import Calculator from './components/Calculator.js'

function App() {
  return (
    <div className='bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen flex flex-col'>
      <div className="container mx-auto text-center h-full flex-1 flex flex-col">
        <header className="flex-none text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl pt-4 pb-4">
          <p className='font-semibold md:font-normal'>
            Сколько налогов я плачу?
          </p>
        </header>
        <div className='flex-1'>
          <Calculator />
        </div>
        <div className='pb-4 mx-auto text-center flex-none'>
          <p>
            &copy;&nbsp;2020&nbsp;
            <a href='//github.com/lazureykis' rel='noreferrer' target='_blank'>
              <img alt="@lazureykis"
                   src="https://avatars2.githubusercontent.com/u/89552?s=60&amp;u=b4c571dd9b2d60f3e2a3ccec03fdb337f8ea316f&amp;v=4"
                   className="rounded-full mx-auto w-8 h-8 inline-block align-middle" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
