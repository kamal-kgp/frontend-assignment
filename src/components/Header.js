import React, { useEffect, useState } from 'react'
import Logo from '../Sidepane/TF logo.svg'
import Metric from '../Sidepane/metrics.png'
import MetricGray from '../Sidepane/metrics-gray.png'
import LogGray from '../Sidepane/list.png'
import list from '../Sidepane/list-active.png'
import chevron from '../Sidepane/chevron.svg'

import Log from './Log';
import Metrics from './Metrics';

import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [logActive, setLogActive] = useState(false);
    const [metricActive, setMetricActive] = useState(false);
    const [time, setTime] = useState('');
    const [unit, setUnit] = useState('');
    const [searchParams] = useSearchParams();

    const handleUrl = () => {
        const Time = searchParams.get('Time') || '';
        const Unit = searchParams.get('Unit') || '';
        const LogActive = (searchParams.get('LogActive') === 'true' ? true : false) || false;
        let show = false
        if(!LogActive) show = searchParams.get('show') === 'true' ? true : false
        console.log(Time, Unit, LogActive, show) 

        if (Time != time || Unit != unit) {
            setTime(Time) 
            setUnit(Unit)
            setLogActive(LogActive);
            if(!LogActive && show) setMetricActive(true) ;
        }
    }

    useEffect(() => {
        handleUrl()
    },[])

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const timeStamps = {
        num: ['5', '10', '15', '30', '1', '3', '6'],
        unit: ['minutes', 'minutes', 'minutes', 'minutes', 'hour', 'hours', 'hours'],
    };
    const handleClickDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSelectTime = (e) => {
        const i = parseInt(e.target.getAttribute('index'));
        setUnit(timeStamps.unit[i]);
        setTime(timeStamps.num[i]);
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <>
            <div className='w-full min-h-[72px] border flex justify-between cursor-default'>
                <div className='w-full min-h-[72px] pt-4 pb-4 pr-8 pl-8 flex justify-between'>
                    <div className='flex gap-x-10'>
                        <div className='h-full flex flex-col justify-center '>
                            <img src={Logo} alt="logo" width={190.85} height={33.75} />
                        </div>
                        <div className='flex min-w-[166px] min-h-[32px] pt-1.5 pb-1 gap-x-5'>
                            <div className='flex flex-col justify-center min-w-[84px] min-h-[32px] gap-2.5' onClick={() => {
                                setLogActive(false);
                                setMetricActive(true);
                                navigate("/metrics")
                            }}>
                                <div className='flex mx-auto min-w-[84px] min-h-[19px] gap-x-1.5 px-1 py-0'>
                                    <div className='flex leading-3 font-black leading-3'>
                                        <img src={metricActive ? Metric : MetricGray} alt="metric" width={20} height={12} />
                                    </div>
                                    <p className={`flex min-w-[58px] min-h-[19px] text-base font-medium leading-5 tracking-normal text-left ${metricActive ? 'text-[#010202] font-[sans-serif]' : 'text-[#4B5563] font-[inter]'}`}>
                                        Metrics
                                    </p>
                                </div>
                                <div></div>
                            </div>
                            <div className='flex flex-col justify-center min-w-[62px] min-h-[32px] gap-2.5' onClick={() => {
                                setLogActive(true);
                                setMetricActive(false);
                                navigate("/logs")
                            }}>
                                <div className='flex mx-auto min-w-[62px] min-h-[19px] gap-x-1.5 px-1 py-0'>
                                    <div className='flex leading-3 font-black leading-3'>
                                        <img src={logActive ? list : LogGray} alt="metric" width={12} height={8} />
                                    </div>
                                    <p className={`flex min-w-[58px] min-h-[19px] text-base font-medium leading-5 tracking-normal text-left ${logActive ? 'text-[#010202] font-[sans-serif]' : 'text-[#4B5563] font-[inter]'}`}>
                                        Logs
                                    </p>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className='relative flex items-center justify-center'>
                        <button className='flex items-center justify-center bg-[#FFFFFF] w-[118px] h-[26px] border border-solid border-[#BBD2F1] rounded pt-1 px-2 pb-1 gap-x-1.5' onClick={() => { handleClickDropdown() }}>
                            <div className='flex-shrink-0 h-[17px] font-[Work Sans] font-medium text-xs text-[#3E5680] leading-4 text-center tracking-normal'>
                                {`Last ${time || 'timestamp'} ${unit || ''}`}
                            </div>
                            <div className='w-2 h-2'>
                                <img src={chevron} alt="chevron-down" width={8} height={8} />
                            </div>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 z-10 top-[-10px] ml-[4032px] w-[143px] origin-top-right border-[0.3px] border-[#BBD2F1] rounded-md bg-white shadow-lg px-2 py-3 gap-3" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div className='w-[127px] min-h-[207px] gap-2.5 divide-y divide-[#E0ECFD]'>
                                    {
                                        timeStamps.num.map((item, i) => (
                                            <div key={i} className="py-1" index={i} onClick={(e) => handleSelectTime(e)}>
                                                {`Last ${item} ${timeStamps.unit[i]}`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {
                logActive ? <Log key = {'log'} time={time} unit={unit} logOpen={logActive} /> 
                : <Metrics key = {time+'metric'} time={time} unit={unit} metricOpen={metricActive} logOpen={logActive} show={true} />
            }
        </>
    )
}
