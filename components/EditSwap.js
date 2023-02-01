import { useEffect, useState } from 'react'
import { ImArrowLeft2 } from 'react-icons/im'
import { TbTrash } from 'react-icons/tb'

const EditSwap = (props) => {
    const [displayedFlowRate, setDisplayedFlowRate] = useState(props.positions[props.editingPosition].token == 0 ? props.positions[props.editingPosition].flowA : props.positions[props.editingPosition].flowB);
    const [displayedBalance0, setDisplayedBalance0] = useState(props.positions[props.editingPosition].balanceA);
    const [displayedBalance1, setDisplayedBalance1] = useState(props.positions[props.editingPosition].balanceB);
    const [token, setToken] = useState(props.positions[props.editingPosition].token);

    const updatePosition = (fr) => {
        const flowRate = fr != undefined ? fr : (isNaN(parseFloat(displayedFlowRate)) ? 0 : parseFloat(displayedFlowRate));
        
        const balance0 = isNaN(parseFloat(displayedBalance0)) ? 0 : parseFloat(displayedBalance0);
        const balance1 = isNaN(parseFloat(displayedBalance1)) ? 0 : parseFloat(displayedBalance1);
        
        props.setTotalFlowA(a => a - (props.positions[props.editingPosition].flowA));
        props.setTotalFlowB(b => b - (props.positions[props.editingPosition].flowB));
        props.setTotalSwapFlowA(a => a - (props.positions[props.editingPosition].flowA));
        props.setTotalSwapFlowB(b => b - (props.positions[props.editingPosition].flowB));

        const nextPositions = props.positions.map((p, i) => {
            if (props.editingPosition == i) {
                return {
                    ...p,
                    balanceA: (p.token == 0 ? balance0 - (p.flowA * (props.time - p.initialTimestamp)) : balance0 + (p.flowB * (1-props.poolFee) * (props.cumulativeB - p.initialCumulative))),
                    balanceB: (p.token == 1 ? balance1 - (p.flowB * (props.time - p.initialTimestamp)) : balance1 + (p.flowA * (1-props.poolFee) * (props.cumulativeA - p.initialCumulative))),
                    token: token,
                    flowA: token == 0 ? flowRate : 0,
                    flowB: token == 1 ? flowRate : 0,
                    initialTimestamp: props.time,
                    initialCumulative: token == 0 ? props.cumulativeA : props.cumulativeB
                };
            } else {
                return p;
            }
        });
        props.setPositions(nextPositions);

        if (token == 0) {
            props.setTotalFlowA(a => a + flowRate);
            props.setTotalSwapFlowA(a => a + flowRate);
        } else {
            props.setTotalFlowB(b => b + flowRate);
            props.setTotalSwapFlowB(b => b + flowRate);
        }
    }

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <form 
            className='w-96 p-8 bg-white shadow-2xl rounded-2xl border-2 space-y-2 poppins-font'
            onSubmit={submit}
        >
            <div className='flex pb-4'>
                <button
                    onClick={() => {
                        updatePosition();
                        props.setEditingPosition(undefined)
                    }}
                >
                    <ImArrowLeft2 size={20}/>
                </button>
                <p className='flex grow justify-center'>
                    <p className='bg-aqBlue/10 text-aqBlue px-4 py-2 rounded-xl font-semibold'>
                        Trader
                    </p>
                </p>
                <button
                    onClick={() => {
                        updatePosition(0);
                        props.setEditingPosition(undefined);
                        props.setPositions(props.positions.filter((p, i) => i !== props.editingPosition));
                    }}
                    className="bg-red-100/50 text-red-600 hover:bg-red-200/50 px-2 rounded-xl"
                >
                    <TbTrash size={20}/>
                </button>
            </div>
            <p>
                Token
            </p>
            <div className='flex space-x-2 pb-8 items-center'>
                <button 
                    onClick={() => {
                        setToken(0);
                    }}
                    className={`w-1/2 border-2 border-usdcBlue/80 text-usdcBlue/80 text-xs font-bold rounded-xl py-4 ${token == 0 ? 'bg-usdcBlue/20' : 'bg-transparent'}`}
                >
                    USDCx
                </button>
                <ImArrowLeft2 
                    size={20} 
                    className={`text-gray-300 ${token == 0 ? 'rotate-180' : 'rotate-0'}`}
                />
                <button 
                    onClick={() => {
                        setToken(1);
                    }}
                    className={`w-1/2 border-2 border-ethPink/80 text-ethPink/80 text-xs font-bold rounded-xl py-4 ${token == 1 ? 'bg-ethPink/20' : 'bg-transparent'}`}
                >
                    ETHx
                </button>
            </div>
            <p>
                Flow Rate
            </p>
            <div className='flex w-full items-center space-x-2 pb-6'>
                <input
                    className='border-2 rounded-xl p-2 w-full monospace-font' 
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={displayedFlowRate}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setDisplayedFlowRate(e.target.value);
                        }
                    }}
                />
                <p className='text-gray-300'>
                    /s
                </p>
            </div>
            <p>
                Balances
            </p>
            <div className='flex space-x-2 items-center'> 
                <img src='/usdc-logo.png' className='h-5 w-5'/>
                <input
                    className='border-2 rounded-xl p-2 w-full monospace-font' 
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={displayedBalance0}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setDisplayedBalance0(e.target.value);
                        }
                    }}
                />
            </div>
            <div className='flex space-x-2 items-center'> 
                <img src='/eth-logo-color.png' className='h-5 w-5 bg-ethPink/80 p-[0.1rem] rounded-full'/>
                <input
                    className='border-2 rounded-xl p-2 w-full monospace-font' 
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={displayedBalance1}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setDisplayedBalance1(e.target.value);
                        }
                    }}
                />
            </div>
        </form>
    )
}

export default EditSwap;