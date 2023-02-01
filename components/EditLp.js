import { useEffect, useState } from 'react'
import { ImArrowLeft2 } from 'react-icons/im'
import { TbTrash } from 'react-icons/tb'

const EditLp = (props) => {
    const [displayedFlowRate0, setDisplayedFlowRate0] = useState(props.positions[props.editingPosition].flowA);
    const [displayedFlowRate1, setDisplayedFlowRate1] = useState(props.positions[props.editingPosition].flowB);
    const [displayedBalance0, setDisplayedBalance0] = useState(props.positions[props.editingPosition].balanceA);
    const [displayedBalance1, setDisplayedBalance1] = useState(props.positions[props.editingPosition].balanceB);
    const [token, setToken] = useState(props.positions[props.editingPosition].token);

    const updatePosition = (fr0, fr1) => {
        const flowRate0 = fr0 != undefined ? fr0 : (isNaN(parseFloat(displayedFlowRate0)) ? 0 : parseFloat(displayedFlowRate0));
        const flowRate1 = fr1 != undefined ? fr1 : (isNaN(parseFloat(displayedFlowRate1)) ? 0 : parseFloat(displayedFlowRate1));

        const balance0 = isNaN(parseFloat(displayedBalance0)) ? 0 : parseFloat(displayedBalance0);
        const balance1 = isNaN(parseFloat(displayedBalance1)) ? 0 : parseFloat(displayedBalance1);

        props.setTotalFlowA(a => a - (props.positions[props.editingPosition].flowA));
        props.setTotalFlowB(b => b - (props.positions[props.editingPosition].flowB));

        const nextPositions = props.positions.map((p, i) => {
            if (props.editingPosition == i) {
                return {
                    ...p,
                    balanceA: (balance0 - (p.flowA * (props.time - p.initialTimestampA)) + (p.flowB * (props.cumulativeB - p.initialCumulativeB))),
                    balanceB: (balance1 - (p.flowB * (props.time - p.initialTimestampB)) + (p.flowA * (props.cumulativeA - p.initialCumulativeA))),
                    token: token,
                    flowA: flowRate0,
                    flowB: flowRate1,
                    initialTimestampA: props.time,
                    initialTimestampB: props.time,
                    initialCumulativeA: props.cumulativeA,
                    initialCumulativeB: props.cumulativeB
                };
            } else {
                return p;
            }
        });
        props.setPositions(nextPositions);

        props.setTotalFlowA(a => a + flowRate0);
        props.setTotalFlowB(b => b + flowRate1);
    }

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <form 
            className='w-96 p-8 bg-white shadow-2xl rounded-3xl border-2 space-y-2 poppins-font'
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
                        Liquidity Provider
                    </p>
                </p>
                <button
                    onClick={() => {
                        updatePosition(0, 0);
                        props.setEditingPosition(undefined);
                        props.setPositions(props.positions.filter((p, i) => i !== props.editingPosition));
                    }}
                    className="bg-red-100/50 text-red-600 hover:bg-red-200/50 px-2 rounded-xl"
                >
                    <TbTrash size={20}/>
                </button>
            </div>
            <p>
                Flow Rates
            </p>
            <div className='flex space-x-2 items-center'> 
                <img src='/usdc-logo.png' className='h-5 w-5'/>
                <input
                    className='border-2 rounded-xl p-2 w-full monospace-font' 
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={displayedFlowRate0}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setDisplayedFlowRate0(e.target.value);
                        }
                    }}
                />
                <p className='text-gray-300'>
                    /s
                </p>
            </div>
            <div className='flex space-x-2 items-center pb-6'> 
                <img src='/eth-logo-color.png' className='h-5 w-5 bg-ethPink/80 p-[0.1rem] rounded-full'/>
                <input
                    className='border-2 rounded-xl p-2 w-full monospace-font' 
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={displayedFlowRate1}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setDisplayedFlowRate1(e.target.value);
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

export default EditLp;