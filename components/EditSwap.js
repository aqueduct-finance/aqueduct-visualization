import { useEffect, useState } from 'react'

const EditSwap = (props) => {
    const [displayedFlowRate, setDisplayedFlowRate] = useState(props.positions[props.editingPosition].token == 0 ? props.positions[props.editingPosition].flowA : props.positions[props.editingPosition].flowB);
    const [token, setToken] = useState(props.positions[props.editingPosition].token);

    const updatePosition = () => {
        const flowRate = isNaN(parseFloat(displayedFlowRate)) ? 0 : parseFloat(displayedFlowRate);
        props.setTotalFlowA(a => a - (props.positions[props.editingPosition].flowA));
        props.setTotalFlowB(b => b - (props.positions[props.editingPosition].flowB));

        const nextPositions = props.positions.map((p, i) => {
            if (props.editingPosition == i) {
                return {
                    ...p,
                    balanceA: (p.token == 0 ? p.balanceA - (p.flowA * (props.time - p.initialTimestamp)) : p.balanceA + (p.flowB * (props.cumulativeB - p.initialCumulative))),
                    balanceB: (p.token == 1 ? p.balanceB - (p.flowB * (props.time - p.initialTimestamp)) : p.balanceB + (p.flowA * (props.cumulativeA - p.initialCumulative))),
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
        } else {
            props.setTotalFlowB(b => b + flowRate);
        }
    }

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <form 
            className='w-96 p-8 bg-white shadow-2xl rounded-2xl border-2 space-y-2'
            onSubmit={submit}
        >
            <div className='flex pb-8'>
                <p className='flex grow'>
                    Swap
                </p>
                <button
                    onClick={() => {
                        updatePosition();
                        props.setEditingPosition(undefined)
                    }}
                >
                    exit
                </button>
            </div>
            <p>
                Token
            </p>
            <div className='flex space-x-2 pb-8'>
                <button 
                    onClick={() => {
                        setToken(0);
                    }}
                    className={`w-1/2 border-2 border-usdcBlue/80 text-usdcBlue/80 text-xs font-bold rounded-xl py-4 ${token == 0 ? 'bg-usdcBlue/20' : 'bg-transparent'}`}
                >
                    USDCx
                </button>
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
                FlowRate
            </p>
            <input
                className='border-2 focus:ring-red-500 focus:border-red-500 rounded-xl p-2 w-full' 
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
        </form>
    )
}

export default EditSwap;