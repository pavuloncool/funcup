import { useState } from "react"
import AnimatedSplash from "./AnimatedSplash"

function App() {

  const [ready, setReady] = useState(false)

  return (
    <>
      {!ready && (
        <AnimatedSplash onFinish={() => setReady(true)} />
      )}

      {ready && (
        <div className="p-10 text-xl">
          Main app
        </div>
      )}
    </>
  )
}

export default App