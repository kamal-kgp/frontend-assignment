import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../Sidepane/Spinner.svg';
import arrow from '../Sidepane/arrow-up-long.png';
import arrowRight from '../Sidepane/arrow-right.png';
import moment from 'moment';

import { MimicLogs } from '../utils/api-mimic';
import { useNavigate } from 'react-router-dom';

export default function Log(props) {
  const [logs, setLogs] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [liveLog, setLiveLog] = useState(false);
  
  const logContainerRef = useRef(null);
  const navigate = useNavigate();

  const time = parseInt(props.time) || 0 ;
  const unit = props.unit || 'minutes';
  const timems = time*(unit === 'minutes' ? 60000 : 3600000); 
  const logActive = props.logOpen || false;
  
  const currentDate = new Date();

  const formattedEndDate = moment().format('DD/MM/YYYY HH:mm'); 
  const formattedStartDate = moment().subtract(timems, 'milliseconds').format('DD/MM/YYYY HH:mm');



  const handleTimestamp = (ts) => {
    const date = new Date(ts);

    const month = date.toLocaleString('en', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const formattedTimestamp = `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    return formattedTimestamp;
  }

  const handleIsBottom = () => {
    if (!logContainerRef.current) return;
    else {
      const element = logContainerRef.current;
      return Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 50;
    }
  }

  const handleClick = () => {
    if (!logContainerRef.current) return;
    else {
      const element = logContainerRef.current;
      element.scrollTop = element.scrollHeight + 100;
    }
  }

  const handleScroll = () => {
    if (!logContainerRef.current) return;
    else {
      const element = logContainerRef.current;
      const isAtBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 50;

      if (isAtBottom) {
        element.scrollTop = element.scrollHeight + 50;
        setLogCount(0); 
      } else {
        setLogCount(prevLogCount => prevLogCount + 1);
      }
    }
  }

  useEffect(() => {
    if(logActive)
      navigate(`/logs?Time=${time}&Unit=${unit}&LogActive=${logActive}`);
  }, [time, unit, logActive]);

  useEffect(() => {
    const startTs = (currentDate.getTime() - timems);
    const endTs = currentDate.getTime(); 
    const limit = 100;
    setLogCount(0);

    MimicLogs.fetchPreviousLogs({ startTs, endTs, limit })  
      .then((logs) => { 
        setLogs(logs); 
        setLiveLog(true); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [time]);

  useEffect(() => {
    if (!liveLog) return;
    else {
      const unsubscribe = MimicLogs.subscribeToLiveLogs((log) => {
        setLogs((prevLogs) => [...prevLogs, log]);
        handleScroll();
      });

      return () => {
        console.log("Unsubscribing from live logs");
        unsubscribe(); 
      };
    }
  }, [liveLog]);

  return (
    logActive ? 
      <>
        <div className="flex flex-col items-center w-full top-[72px] border-[0.4px] border-[#CEE0F8] shadow-logbox pt-0 px-5 pb-5" >
          <div className='flex  w-full items-center h-[35px] pt-4 pb-4 justify-between'>
            <div></div>
            <div className='flex gap-1 items-center w-[323px] h-[35px]'>
              <div className='flex flex-shrink-0 items-center h-[25px] top-[11px] left=[937px] font-[Work Sans] text-xs font-medium leading-4 '>
                {`Showing logs for ${formattedStartDate}`}
              </div>
              <div className='flex flex-shrink-0 transform items-center h-[25px] top-[11px] left=[937px] font-[Work Sans] text-xs font-medium leading-4 text-right '>
                <img src={arrowRight} alt="arrow" width={17} height={17}/>
              </div>
              <div className='flex flex-shrink-0 items-center h-[25px] top-[11px] left=[937px] font-[Work Sans] text-xs font-medium leading-4 text-right '>
                {formattedEndDate}
              </div>
            </div>
          </div>
          <div className='bg-[#090F17] w-full border-0 rounded-lg pt-1 pr-[14px] pb-[14px] pl-3 gap-[11px]'>
            <div className='flex w-full items-center justify-center h-[30px]'>
              <div className='flex items-center w-[174px] h-4 gap-2'>
                <img src={Spinner} alt="spinner" width={16} height={16} />
                <div className='w-[150px] h-[14px] font-[Fira Code] text-[10px] font-[450] leading-3 text-[#82A0CE]'>
                  Loading previous 100 logs
                </div>
              </div>
            </div>
            <div ref={logContainerRef} className='flex flex-col gap-3 h-[600px] overflow-y-auto no-scrollbar' id='log-container'>
              {
                logs.map((log, index) => (
                  <div className='flex items-center w-full h-[17px] gap-[9px] ' key={index}>
                    <div className='bg-[#60A5FA] w-0.5 h-[17px] border-0 rounded-lg'></div>
                    <div className='flex-shrink-0 h-[17px] font-[Fira Code] text-xs font-[450] leading-4 text-[#5E7BAA]'>
                      {handleTimestamp(log.timestamp)}
                    </div>
                    <div className='flex-shrink-0 h-[17px] font-[Fira Code] text-xs font-[450] leading-4 text-[#5E7BAA]'>
                      [info]
                    </div>
                    <div className='w-full text-inline h-[17px] font-[Fira Code] text-xs font-[450] leading-4 text-[#A8C3E8] truncate'>
                      {log.message}
                    </div>
                  </div>
                ))
              }
            </div>
            <div className='fixed bottom-10 right-10 w-[92px] h-[28px]'>
              {
                handleIsBottom() ? null :
                  <div className='flex items-center justify-center fixed w-[92px] h-[28px] border-0 rounded bg-[#4338CA]'>
                    <button className='flex items-center fixed w-[76px] h-[17px] bg-[#4338CA] gap-[1px]' onClick={() => handleClick()}>
                      <p className='w-[64px] h-[14px] font-[Work Sans] font-medium text-[10px] leading-3 text-[#E0ECFD] text-center'>{logCount} new logs</p>
                      <div className='flex items-center justify-center w-2 h-[17px] '>
                        <img src={arrow} alt="arrow" height={17} width={8} />
                      </div>
                    </button>
                  </div>
              }
            </div>
          </div>
        </div>
      </> : null
  )
}





