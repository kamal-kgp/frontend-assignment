import React, { useState, useEffect } from 'react'
import { MimicMetrics } from '../utils/api-mimic';
import MakeChart from '../utils/MakeChart';
import arrowRight from '../Sidepane/arrow-right.png';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


export default function Home(props) {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minute, setMinute] = useState(0);
  const navigate = useNavigate();

  
  const time = parseInt(props.time) || 0 ;
  const unit = props.unit || 'minutes';
  const timems = time*(unit === 'minutes' ? 60000 : 3600000); 
  const logOpen = props.logOpen || false;
  const metricOpen = props.metricOpen || false; 
  const show = props.show || false;

  const currentDate = new Date(); 

  const formattedEndDate = moment().format('DD/MM/YYYY HH:mm');
  const formattedStartDate = moment().subtract(timems, 'milliseconds').format('DD/MM/YYYY HH:mm');

  useEffect(() => {
    if(metricOpen)
      navigate(`/metrics?Time=${time}&Unit=${unit}&LogActive=${logOpen}&show=${show}`);
  }, [time, unit, logOpen, metricOpen, show]);

  useEffect(() => {
    if(currentDate.getMinutes() === minute) return 
    else{
      const startTs = currentDate.getTime() - timems;
      const endTs = currentDate.getTime();
      setMinute(currentDate.getMinutes());
      const fetchData = async () => {         
        try {
          const data = await MimicMetrics.fetchMetrics({ startTs, endTs });
          setMetrics(data);
          setIsLoading(false); 
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
      };
  
      fetchData();
    }
    
  }, [time, currentDate]);

  return ( 
    (logOpen || !show) ? null :              
    <>
      <div className='flex justify-center items-center pt-2 pb-3 pr-2 pl-2'>
        <div className='flex flex-col items-center min-h-[781px] min-w-[1240px] top-[84px] left-5 border rounded-lg border-[#CEE0F8] px-5 py-4 gap-4'>
          <div className='w-full min-h[49px] gap-3'>
            <div className='flex justify-between w-full h-9'>
              <div className='flex w-[436px] items-center min-h[30px] gap-2'>
                <div className='w-[85px] h-[30px] font-[sans-serif] font-bold text-2xl leading-[1.875rem] text-[#010202]'>
                  Metrics
                </div>
                <div className='flex items-center w-[221px] h-[15px] gap-1'>
                  <p className='flex flex-shrink-0 h-[15px] font-[Work Sans] text-xs font-medium text-[#1C2A42]'>{formattedStartDate}</p>
                  <div className='flex flex-shrink-0 items-center justify-center h-[15px] text-xs font-normal font-[Font Awesome 6 Pro]'>
                   <img src={arrowRight} alt="arrow" width={17} height={17}/>
                  </div>
                  <p className='flex flex-shrink-0 h-[15px] font-[Work Sans] text-xs font-medium text-[#1C2A42]'>{formattedEndDate}</p>
                </div>
              </div>
              <div></div>
              <div></div>
            </div>
            <div className='w-full h-[1px] '></div>
          </div>
          <div className='flex flex-col bg-[#F0F7FF] w-full min-h-[700px] border-t border-t-[#CEE0F8] gap-4'>
            <div className='flex min-w-[1200px] min-h-[334px] gap-5 px-3 mt-4'>
              <div className='bg-[#FFFFFF] w-[590px] min-h-[334px] border rounded-lg border-[#CEE0F8] pt-3 px-4 pb-4 gap-[13px]' role='CPU Usage'>
                <div className='w-full min-h-5 gap-2' role='heading'>
                  <div className='flex w-full min-h-5 justify-between'>
                    <p className='w-[75px] h-[20px] font-[Work Sans] font-semibold text-sm text-[#3E5680] '>CPU Usage</p>
                    <div className='min-w-[40px] min-h-[18px] px-1 py-0.5'></div>
                  </div>
                </div>
                <div className='w-full min-h-[273px] gap-4' role='CPU Usage chart'>
                  <div className='w-[100%] h-[100%]' role='chart' id='CPU Usage'>
                    {isLoading ? <p>Loading...</p> : MakeChart(metrics[0])}
                  </div>
                </div> 
              </div>
              <div className='bg-[#FFFFFF] w-[590px] min-h-[334px] border rounded-lg border-[#CEE0F8] pt-3 px-4 pb-4 gap-[13px]' role='Memory Usage'>
                <div className='w-full min-h-5 gap-2' role='heading'>
                  <div className='flex w-full min-h-5 justify-between'>
                    <p className='w-[101px] h-[20px] font-[Work Sans] font-semibold text-sm text-[#3E5680] '>Memory Usage</p>
                    <div className='min-w-[40px] min-h-[18px] px-1 py-0.5'></div>
                  </div>
                </div>
                <div className='w-full min-h-[273px] gap-4' role='Memory Usage chart'>
                  <div className='w-[100%] h-[100%]' role='chart' id='Memory Usage'>
                    {isLoading ? <p>Loading...</p> : MakeChart(metrics[1])}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex min-w-[1200px] min-h-[334px] gap-5 px-3'>
              <div className='bg-[#FFFFFF] w-[590px] min-h-[334px] border rounded-lg border-[#CEE0F8] pt-3 px-4 pb-4 gap-[13px]' role='Network Usage'>
                <div className='w-full min-h-5 gap-2' role='heading'>
                  <div className='flex w-full min-h-5 justify-between'>
                    <p className='w-[105px] h-[20px] font-[Work Sans] font-semibold text-sm text-[#3E5680] '>Network Usage</p>
                    <div className='min-w-[40px] min-h-[18px] px-1 py-0.5'></div>
                  </div>
                </div>
                <div className='w-full min-h-[273px] gap-4' role='Network Usage chart'>
                  <div className='w-[100%] h-[100%]' role='chart' id='Network Usage'>
                    {isLoading ? <p>Loading...</p> : MakeChart(metrics[2])}
                  </div> 
                </div>
              </div>
              <div className='bg-[#FFFFFF] w-[590px] min-h-[334px] border rounded-lg border-[#CEE0F8] pt-3 px-4 pb-4 gap-[13px]' role='Disk IOPS'>
                <div className='w-full min-h-5 gap-2' role='heading'>
                  <div className='flex w-full min-h-5 justify-between'>
                    <p className='w-[67px] h-[20px] font-[Work Sans] font-semibold text-sm text-[#3E5680] '>Disk IOPS</p>
                    <div className='min-w-[40px] min-h-[18px] px-1 py-0.5'></div>
                  </div>
                </div>
                <div className='w-full min-h-[273px] gap-4' role='disk IOPS chart'>
                  <div className='w-[100%] h-[100%]' role='chart' id='Disk IOPS'>
                    {isLoading ? <p>Loading...</p> : MakeChart(metrics[3])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </> 
  )
}

