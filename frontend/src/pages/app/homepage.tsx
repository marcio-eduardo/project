import imagem3 from "@/assets/003.png"

export function Homepage() {
  return (    
    <main className="p-5 md:p-20 grid grid-rows-2 grid-cols-2 gap-4 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-center bg-gray-300 rounded-lg text-center">
        {/* Imagem de exemplo */}
        <img className="w-full h-full object-cover rounded-lg" src={ imagem3 }  alt="Imagem de uma dentadura" />
      </div>

      <div className="bg-cyan-300 p-5 rounded-lg ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim 
        id est laborum.
      </div>

      <div className="bg-red-200 p-5 rounded-lg col-span-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
        officia deserunt mollit anim id est laborum. Excepteur sint occaecat 
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim 
        id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in 
        culpa qui officia deserunt mollit anim id est laborum. in culpa qui 
        officia deserunt mollit. Lorem ipsum dolor sit amet, consectetur adipiscing 
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
        officia deserunt mollit anim id est laborum. Excepteur sint occaecat 
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim 
        id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in 
        culpa qui officia deserunt mollit anim id est laborum. in culpa qui 
        officia deserunt mollit.
      </div>
    </main>
  );
}