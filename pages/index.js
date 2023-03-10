import { RiUser3Line } from 'react-icons/ri'
import { AiFillPlusCircle } from 'react-icons/ai'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { useEffect, useState, useRef } from 'react'
import Switch from "react-switch";
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import EditSwap from '@/components/EditSwap';
import EditLp from '@/components/EditLp';
import { ArcherContainer, ArcherElement } from 'react-archer';

const ANIMATION_MINIMUM_STEP_TIME = 100;

export default function LPandTraderWithFees() {

    /* mock fda */
    const [cumulativeA, setCumulativeA] = useState(0);
    const [cumulativeB, setCumulativeB] = useState(0);
    const [rewardsCumulativeA, setRewardsCumulativeA] = useState(0);
    const [rewardsCumulativeB, setRewardsCumulativeB] = useState(0);
    const [time, setTime] = useState(0);

    /* animation */
    const [tick, setTick] = useState(0);
    useEffect(() => {
        // only run when switched to 'running' and the edit modals are closed
        if (running && editingPosition == undefined && editingLpPosition == undefined) {
            const timer = setTimeout(() => {
                // update tick for animation
                setTick(t => t + 1);

                // update timestamp and cumulatives
                setTime(t => t + (ANIMATION_MINIMUM_STEP_TIME/1000));
                if (totalFlowA > 0 && totalFlowB > 0) {
                    setCumulativeA(c => c + (totalFlowB / totalFlowA * (ANIMATION_MINIMUM_STEP_TIME/1000)));
                    setCumulativeB(c => c + (totalFlowA / totalFlowB * (ANIMATION_MINIMUM_STEP_TIME/1000)));

                    if (totalLiquidityFlowA > 0 && totalLiquidityFlowB > 0) {
                        setRewardsCumulativeA(c => c + (totalSwapFlowB * (totalFlowA/totalFlowB) * poolFee / totalLiquidityFlowA * (ANIMATION_MINIMUM_STEP_TIME/1000)));
                        setRewardsCumulativeB(c => c + (totalSwapFlowA * (totalFlowB/totalFlowA) * poolFee / totalLiquidityFlowB * (ANIMATION_MINIMUM_STEP_TIME/1000)));
                    }
                }
            }, ANIMATION_MINIMUM_STEP_TIME);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [tick]);
    const [running, setRunning] = useState(false);

    /* pool vars */
    const [totalFlowA, setTotalFlowA] = useState(0);
    const [totalFlowB, setTotalFlowB] = useState(0);
    const [totalSwapFlowA, setTotalSwapFlowA] = useState(0);
    const [totalSwapFlowB, setTotalSwapFlowB] = useState(0);
    const [totalLiquidityFlowA, setTotalLiquidityFlowA] = useState(0);
    const [totalLiquidityFlowB, setTotalLiquidityFlowB] = useState(0);
    const poolFee = 0.005;
    //const protocolFee = 0.05;

    /* regular swap positions */
    const [positions, setPositions] = useState([]);
    const [editingPosition, setEditingPosition] = useState(undefined);

    /* lp positions */
    const [lpPositions, setLpPositions] = useState([]);
    const [editingLpPosition, setEditingLpPosition] = useState(undefined);

    // start timer again if switched on, or closed editing modal
    useEffect(() => {
        setTick(t => t + 1);
    }, [running, editingPosition, editingLpPosition])

    return (
        <div 
            className={`p-16 flex flex-col h-screen w-screen`}
        >
            <ArcherContainer strokeColor="red" className={`flex flex-col w-full h-full overflow-hidden`}>
                <div className='flex flex-col space-y-2'>
                    <div className='flex'>
                        <div className='flex border-2 border-aqBlue/10 text-aqBlue font-bold w-min px-2 py-2 space-x-1 rounded-full'>
                            <p className='mx-2'>Pool:</p>
                            <div className='bg-usdcBlue/20 text-usdcBlue/80 text-xs font-bold w-min px-3 py-1 rounded-full whitespace-nowrap'>
                                USDCx
                            </div>
                            <div className='bg-ethPink/20 text-ethPink/80 text-xs font-bold w-min px-3 py-1 rounded-full whitespace-nowrap'>
                                ETHx
                            </div>
                        </div>
                        <div className='flex grow items-center justify-center'>
                            <Switch 
                                onChange={(v) => {
                                    setRunning(v);
                                }} 
                                checked={running} 
                                onColor='#0160D1'
                                activeBoxShadow='0 0 2px 3px #0160D188'
                                uncheckedIcon={
                                    <div className='flex h-full w-full items-center justify-center text-white'> 
                                        <BsFillPauseFill /> 
                                    </div>
                                }
                                checkedIcon={
                                    <div className='flex h-full w-full items-center justify-center text-white'> 
                                        <BsFillPlayFill /> 
                                    </div>
                                }
                            />
                        </div>
                        <button 
                            className='flex items-center bg-aqBlue/10 text-aqBlue font-bold pr-4 px-2 space-x-2 rounded-full'
                            onClick={() => {
                                setPositions(oldArray => [...oldArray, {
                                    flowA: 0,
                                    flowB: 0,
                                    balanceA: 1000,
                                    balanceB: 1000,
                                    token: 0,
                                    initialCumulative: 0,
                                    initialTimestamp: 0,
                                }]);
                            }}
                        >
                            <AiFillPlusCircle size={28}/>
                            <p>
                                Swap Position
                            </p>
                        </button>
                    </div>
                    <div className='flex w-full'>
                        <div className='flex border-2 border-aqBlue/10 text-aqBlue font-bold w-min px-2 py-2 space-x-1 rounded-full'>
                            <p className='mx-2 whitespace-nowrap'>Fee: &nbsp;0.5%</p>
                        </div>
                        <div className='flex grow' />
                        <button 
                            className='flex items-center bg-aqBlue/10 text-aqBlue font-bold pr-4 px-2 space-x-2 rounded-full'
                            onClick={() => {
                                setLpPositions(oldArray => [...oldArray, {
                                    flowA: 0,
                                    flowB: 0,
                                    balanceA: 1000,
                                    balanceB: 1000,
                                    initialCumulativeA: 0,
                                    initialTimestampA: 0,
                                    initialCumulativeB: 0,
                                    initialRewardsCumulativeA: 0,
                                    initialRewardsCumulativeB: 0,
                                    initialTimestampB: 0,
                                    rewardPercentage: 0
                                }]);
                            }}
                        >
                            <AiFillPlusCircle size={28}/>
                            <p>
                                LP Position
                            </p>
                        </button>
                    </div>
                </div>
                <div className="flex space-x-32 items-center justify-center h-[80%] mt-8 overflow-hidden">
                    <div className='flex flex-col items-center justify-center space-y-2 w-[22rem] flex-shrink-0'>
                        {
                            positions.map((p, i) => {
                                return (
                                    <ArcherElement
                                        id={'swap-' + i}
                                        relations={[
                                            {
                                                targetId: p.token == 0 ? 'token0Liquidity' : 'token1Liquidity',
                                                targetAnchor: 'left',
                                                sourceAnchor: 'right',
                                                style: { strokeColor: (p.flowA > 0 ? '#2775CA55' : (p.flowB > 0 ? '#E7018A55' : '#00000000')) }
                                            },
                                        ]}
                                    >
                                        <div className='flex w-full px-4 py-4 border-2 border-gray-200 shadow-lg rounded-2xl text-sm space-x-4' >
                                            <div className='flex flex-col space-y-2'>
                                                <div className='flex items-center justify-center bg-gray-100 px-2 rounded-lg h-full'>
                                                    <RiUser3Line />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setEditingPosition(i);
                                                    }}
                                                    className='bg-gray-100 border-2 px-2 rounded-lg h-full'
                                                >
                                                    <FiSettings size={15}/>
                                                </button>
                                            </div>
                                            <div className='w-2/3 space-y-2'>
                                                <p>
                                                    Balances:
                                                </p>
                                                <div className='flex space-x-2'>
                                                    <img src='/usdc-logo.png' className='h-5 w-5'/>
                                                    <input 
                                                        className='w-full outline-none monospace-font'
                                                        readonly
                                                        value={   
                                                            p.token == 0 ? 
                                                            Number((p.balanceA - (p.flowA * (time - p.initialTimestamp))).toFixed(10)) : 
                                                            Number((p.balanceA + (p.flowB * (1-poolFee) * (cumulativeB - p.initialCumulative))).toFixed(10))
                                                        }
                                                    />
                                                </div>
                                                <div className='flex space-x-2'>
                                                    <img src='/eth-logo-color.png' className='h-5 w-5 bg-ethPink/80 p-[0.1rem] rounded-full'/>
                                                    <input 
                                                        className='w-full outline-none monospace-font'
                                                        readonly
                                                        value={  
                                                            p.token == 1 ? 
                                                            Number((p.balanceB - (p.flowB * (time - p.initialTimestamp))).toFixed(10)) : 
                                                            Number((p.balanceB + (p.flowA * (1-poolFee) * (cumulativeA - p.initialCumulative))).toFixed(10))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className='w-1/3 space-y-2'>
                                                <p>
                                                    Flowrates:
                                                </p>
                                                <input 
                                                    className='w-full outline-none monospace-font'
                                                    readonly
                                                    value={(p.token == 0 ? ('-' + p.flowA) : ('+' + (totalFlowB > 0 ? p.flowB * (1 - poolFee) * totalFlowA / totalFlowB : 0)))}
                                                />
                                                <input 
                                                    className='w-full outline-none monospace-font'
                                                    readonly
                                                    value={(p.token == 1 ? ('-' + p.flowB) : ('+' + (totalFlowA > 0 ? p.flowA * (1 - poolFee) * totalFlowB / totalFlowA : 0)))}
                                                />
                                            </div>
                                        </div>
                                    </ArcherElement>
                                )
                            })
                        }
                    </div>
                    <ArcherElement 
                        id='poolRep'
                    >
                        <div className='flex flex-col w-64 h-96 border-2 border-aqBlue rounded-3xl p-4 space-y-2 flex-shrink-0'>
                            <div className='w-full'>
                                <img src='aq-logo.png' className='h-10 w-10 rounded-xl' />
                            </div>
                            <p className='text-sm text-aqBlue font-bold opacity-0'>
                                Liquidity
                            </p>
                            <div className='flex flex-col w-full h-full border-[0.1rem] border-aqBlue rounded-xl p-2 space-y-1'>
                                <p className='text-sm text-aqBlue'>
                                    Liquidity
                                </p>
                                <div className='flex flex-col h-full'>
                                    <ArcherElement
                                        id='token0Liquidity'
                                    >
                                        <div className='flex space-x-2 items-center px-2 w-full h-full bg-usdcBlue/20 rounded-lg font-bold text-usdcBlue'>
                                            <img src='/usdc-logo.png' className='h-5 w-5'/>
                                            <input 
                                                className='w-full outline-none bg-transparent monospace-font'
                                                readonly
                                                value={totalFlowA}
                                            />
                                        </div>
                                    </ArcherElement>
                                    <div className='h-0 pt-1 -translate-y-9'>
                                        {
                                            positions.map((p, i) => {
                                                if (p.token == 1 && p.flowB > 0) {
                                                    return (
                                                        <ArcherElement
                                                            id={'pos-arrow-token0-' + i}
                                                            relations={[
                                                                {
                                                                    targetId: ('swap-' + i),
                                                                    targetAnchor: 'right',
                                                                    sourceAnchor: 'left',
                                                                    style: { strokeColor: '#2775CACC' }
                                                                },
                                                            ]}
                                                        >
                                                            <div className='h-0' />
                                                        </ArcherElement>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    <div className='h-0 -translate-y-9'>
                                        {
                                            lpPositions.map((p, i) => {
                                                if (p.flowB > 0) {
                                                    return (
                                                        <ArcherElement
                                                            id={'lp-arrow-token0-' + i}
                                                            relations={[
                                                                {
                                                                    targetId: ('lp-token0-' + i),
                                                                    targetAnchor: 'left',
                                                                    sourceAnchor: 'right',
                                                                    style: { strokeColor: '#2775CACC' }
                                                                },
                                                            ]}
                                                        >
                                                            <div className='h-0' />
                                                        </ArcherElement>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    <div className='h-0 translate-y-9'>
                                        {
                                            lpPositions.map((p, i) => {
                                                if (p.flowA > 0) {
                                                    return (
                                                        <ArcherElement
                                                            id={'lp-arrow-token1' + i}
                                                            relations={[
                                                                {
                                                                    targetId: ('lp-token1-' + i),
                                                                    targetAnchor: 'left',
                                                                    sourceAnchor: 'right',
                                                                    style: { strokeColor: '#E7018ACC' }
                                                                },
                                                            ]}
                                                        >
                                                            <div className='h-0' />
                                                        </ArcherElement>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    <div className='h-0 pb-1 translate-y-9'>
                                        {
                                            positions.map((p, i) => {
                                                if (p.token == 0 && p.flowA > 0) {
                                                    return (
                                                        <ArcherElement
                                                            id={'pos-arrow-token1-' + i}
                                                            relations={[
                                                                {
                                                                    targetId: ('swap-' + i),
                                                                    targetAnchor: 'right',
                                                                    sourceAnchor: 'left',
                                                                    style: { strokeColor: '#E7018ACC' }
                                                                },
                                                            ]}
                                                        >
                                                            <div className='h-0' />
                                                        </ArcherElement>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    <ArcherElement
                                        id='token1Liquidity'
                                    >
                                        <div className='flex space-x-2 items-center px-2 w-full h-full bg-ethPink/20 rounded-lg font-bold text-ethPink'>
                                            <img src='/eth-logo-color.png' className='h-5 w-5 bg-ethPink/80 p-[0.1rem] rounded-full'/>
                                            <input 
                                                className='w-full outline-none bg-transparent monospace-font'
                                                readonly
                                                value={totalFlowB}
                                            />
                                        </div>
                                    </ArcherElement>
                                </div>
                            </div>
                            <div className={`flex flex-col w-full h-full border-[0.1rem] border-aqBlue rounded-xl p-2 space-y-1`}>
                                <p className='text-sm text-aqBlue'>
                                    Price
                                </p>
                                <div className='flex flex-col flex-grow items-center justify-center monospace-font'>
                                    <p className='-mt-4 text-ethPink/80 font-bold'>
                                        1 ETHx = 
                                    </p>
                                    <p className='text-usdcBlue/80 font-bold'>
                                        {
                                            (totalFlowA > 0 && totalFlowB > 0) ? Number((totalFlowA / totalFlowB).toFixed(8)) + ' USDCx' : '__ USDCx'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ArcherElement>
                    <div className='flex flex-col items-center justify-center space-y-2 w-[28rem] flex-shrink-0'>
                        {
                            lpPositions.map((p, i) => {
                                return (
                                    <div className='flex w-full px-4 py-4 border-2 border-gray-200 shadow-lg rounded-2xl text-sm space-x-4' >
                                        <div className='w-0 flex flex-col -mr-4 -translate-x-4'>
                                            <ArcherElement
                                                id={'lp-token0-' + i}
                                                relations={[
                                                    {
                                                        targetId: 'token0Liquidity',
                                                        targetAnchor: 'right',
                                                        sourceAnchor: 'left',
                                                        style: { strokeColor: '#2775CA' + (p.flowA > 0 ? '55' : '00') }
                                                    },
                                                ]}
                                            >
                                                <div className='h-full w-0' />
                                            </ArcherElement>
                                            <ArcherElement
                                                id={'lp-token1-' + i}
                                                relations={[
                                                    {
                                                        targetId: 'token1Liquidity',
                                                        targetAnchor: 'right',
                                                        sourceAnchor: 'left',
                                                        style: { strokeColor: '#E7018A' + (p.flowB > 0 ? '55' : '00') }
                                                    },
                                                ]}
                                            >
                                                <div className='h-full w-0' />
                                            </ArcherElement>
                                        </div>
                                        <div className='flex flex-col space-y-2'>
                                            <p className='flex items-center justify-center bg-gray-100 px-2 rounded-lg h-full'>
                                                LP
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setEditingLpPosition(i);
                                                }}
                                                className='bg-gray-100 border-2 px-2 rounded-lg h-full'
                                            >
                                                <FiSettings size={15}/>
                                            </button>
                                        </div>
                                        <div className='w-2/3 space-y-2'>
                                            <p>
                                                Balances:
                                            </p>
                                            <div className='flex space-x-2'>
                                                <img src='/usdc-logo.png' className='h-5 w-5'/>
                                                <input 
                                                    className='w-full outline-none monospace-font'
                                                    readonly
                                                    value={ 
                                                        Number((p.balanceA - (p.flowA * (time - p.initialTimestampA)) + (p.flowB * (cumulativeB - p.initialCumulativeB)) + (p.flowA * p.rewardPercentage * (rewardsCumulativeA - p.initialRewardsCumulativeA))).toFixed(10))
                                                    }
                                                />
                                            </div>
                                            <div className='flex space-x-2'>
                                                <img src='/eth-logo-color.png' className='h-5 w-5 bg-ethPink/80 p-[0.1rem] rounded-full'/>
                                                <input 
                                                    className='w-full outline-none monospace-font'
                                                    readonly
                                                    value={
                                                        Number((p.balanceB - (p.flowB * (time - p.initialTimestampB)) + (p.flowA * (cumulativeA - p.initialCumulativeA)) + (p.flowB * p.rewardPercentage * (rewardsCumulativeB - p.initialRewardsCumulativeB))).toFixed(10))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className='w-full space-y-2'>
                                            <p>
                                                Flowrates:
                                            </p>
                                            <div className='flex'>
                                            <input 
                                                className='w-full outline-none monospace-font'
                                                readonly
                                                value={
                                                    (-1 * p.flowA) + ' + ' + ((totalFlowB > 0 ? p.flowB * totalFlowA / totalFlowB : 0) + (totalLiquidityFlowA > 0 ? p.flowA * p.rewardPercentage * (totalSwapFlowB * poolFee * (totalFlowA/totalFlowB)) / totalLiquidityFlowA : 0)) + ' = '
                                                    + ((-1 * p.flowA) + ((totalFlowB > 0 ? p.flowB * totalFlowA / totalFlowB : 0) + (totalLiquidityFlowA > 0 ? p.flowA * p.rewardPercentage * (totalSwapFlowB * poolFee * (totalFlowA/totalFlowB)) / totalLiquidityFlowA : 0)))
                                                }
                                            />
                                            </div>
                                            <input 
                                                className='w-full outline-none monospace-font'
                                                readonly
                                                value={
                                                    (-1 * p.flowB) + ' + ' + ((totalFlowA > 0 ? p.flowA * totalFlowB / totalFlowA : 0) + (totalLiquidityFlowB > 0 ? p.flowB * p.rewardPercentage * (totalSwapFlowA * poolFee * (totalFlowB/totalFlowA)) / totalLiquidityFlowB : 0)) + ' = '
                                                    + ((-1 * p.flowB) + ((totalFlowA > 0 ? p.flowA * totalFlowB / totalFlowA : 0) + (totalLiquidityFlowB > 0 ? p.flowB * p.rewardPercentage * (totalSwapFlowA * poolFee * (totalFlowB/totalFlowA)) / totalLiquidityFlowB : 0)))
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Modal
                    isOpen={editingPosition != undefined}
                    className='flex w-full h-full backdrop-blur-md items-center justify-center'
                >
                    {
                        editingPosition != undefined &&
                        <EditSwap
                            positions={positions}
                            setPositions={setPositions}
                            editingPosition={editingPosition}
                            setEditingPosition={setEditingPosition}
                            setTotalFlowA={setTotalFlowA}
                            setTotalFlowB={setTotalFlowB}
                            cumulativeA={cumulativeA}
                            cumulativeB={cumulativeB}
                            time={time}
                            setTotalSwapFlowA={setTotalSwapFlowA}
                            setTotalSwapFlowB={setTotalSwapFlowB}
                            poolFee={poolFee}
                        />
                    }
                </Modal>
                <Modal
                    isOpen={editingLpPosition != undefined}
                    className='flex w-full h-full backdrop-blur-md items-center justify-center'
                >
                    {
                        editingLpPosition != undefined &&
                        <EditLp
                            positions={lpPositions}
                            setPositions={setLpPositions}
                            editingPosition={editingLpPosition}
                            setEditingPosition={setEditingLpPosition}
                            setTotalFlowA={setTotalFlowA}
                            setTotalFlowB={setTotalFlowB}
                            cumulativeA={cumulativeA}
                            cumulativeB={cumulativeB}
                            rewardsCumulativeA={rewardsCumulativeA}
                            rewardsCumulativeB={rewardsCumulativeB}
                            time={time}
                            setTotalSwapFlowA={setTotalSwapFlowA}
                            setTotalSwapFlowB={setTotalSwapFlowB}
                            setTotalLiquidityFlowA={setTotalLiquidityFlowA}
                            setTotalLiquidityFlowB={setTotalLiquidityFlowB}
                            poolFee={poolFee}
                        />
                    }
                </Modal>
            </ArcherContainer>
        </div>
    )
}