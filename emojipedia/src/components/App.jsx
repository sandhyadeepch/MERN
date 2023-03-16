import React from "react";
import Emoji from "./Term";
import Emojipedia from "../emojipedia";

function createEmoji(emoji){
    return(
        <Emoji 
            key={emoji.id}
            emoji={emoji.emoji}
            name={emoji.name}
            meaning={emoji.meaning}
        />
    );
}

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>

      <dl className="dictionary">
        {Emojipedia.map(createEmoji)}
    
      </dl>
    </div>
  );
}

export default App;
