import React , {useState , useEffect}from 'react';
import { AnimatePresence,motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store';
import {download, logoShirt, stylishShirt} from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation,slideAnimation } from '../config/motion';
import { AIpicker,ColorPicker,CustomButton,FilePicker,Tab } from '../components';
const Customizer = () => {
  const snap = useSnapshot(state);
  const [file,setfile] = useState('');
  const [prompt , setprompt] = useState('');
  const [generatingimg,setgen] = useState(false);
  const [activeEditor , setActiveEditor] = useState("");
  const[activeFilter,setFilter] = useState({
    logoShirt:true,
    stylishShirt:false,
  })
  //show tab content depending on active tab
  const generateTab = () => {
    switch(activeEditor){
      case "colorpicker":
        return <ColorPicker/>
      case "filepicker":
        return <FilePicker
        file = {file}
        setFile = {setfile}
        readFile = {readFile}/>
      case "aipicker":
        return <AIpicker
        prompt = {prompt}
        setPrompt = { setprompt }
        generatingImg = {generatingimg}
        handleSubmit = {handleSubmit}/>
      default:
        return null
    }
  }
  const handleSubmit = async(type) => {
    if(!prompt) return alert("Please enter the prompt");
    try {
      //call our backend to generate ai image
      setgen(true);
      const  response = await fetch('http://localhost:8080/api/v1/dalle',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          prompt
        })
      })
      const data = await response.json();
      handleDecal(type,`data:image/png;base64,${data.photo}`);
    }catch (error){
      alert(error)
    }finally{
      setgen(false);
      setActiveEditor("")
    }
  }
  const handleDecal = (type,result) => {
    const decaltype = DecalTypes[type];
    state[decaltype.stateProperty] = result;
    if(!activeFilter[decaltype.filterTab]){
      handleActiveFilter(decaltype.filterTab)
    }
  }
  const handleActiveFilter = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilter[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilter[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    //after setting the state , activefilter gets updated
    setFilter((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

    //function for handling file picking , file picking logic
  const readFile = (type) => {
    reader(file)
    .then((result) => {
      handleDecal(type,result);
      setActiveEditor("");  
    })
  }
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
          key = "custom"
          className="absolute top-0 left-0 z-10"
          {...slideAnimation('left')}>
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) =>(
                  <Tab
                  key = {tab.name}
                  tab = {tab}
                  handleClick = {() => setActiveEditor(tab.name)}/>
                ))}
                {generateTab()}
              </div>
            </div>
          </motion.div>

          <motion.div 
          className='absolute z-10 top-5 right-5'
          {...fadeAnimation}>
            <CustomButton
            type = 'filled'
            title = 'Go back'
            handleClick={() => {state.intro = true}}
            customStyles='w-fit px-4 py-2.5 font-bold text-sm rounded-lg'/>
          </motion.div>
          <motion.div
          className='filtertabs-container'
          {...slideAnimation('up')}>
            {FilterTabs.map((tab) =>(
                  <Tab
                  key = {tab.name}
                  tab = {tab}
                  isFilterTab
                  isAvtiveTab= {activeFilter[tab.name]}
                  handleClick = {() => handleActiveFilter(tab.name)}/>
                ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer