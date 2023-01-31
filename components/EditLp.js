import { useEffect, useState } from 'react'

const EditLp = (props) => {
    const [displayedFlowRate0, setDisplayedFlowRate0] = useState(props.positions[props.editingPosition].flowA);
    const [displayedFlowRate1, setDisplayedFlowRate1] = useState(props.positions[props.editingPosition].flowB);
    const [token, setToken] = useState(props.positions[props.editingPosition].token);

    const updatePosition = () => {
        const flowRate0 = isNaN(parseFloat(displayedFlowRate0)) ? 0 : parseFloat(displayedFlowRate0);
        const flowRate1 = isNaN(parseFloat(displayedFlowRate1)) ? 0 : parseFloat(displayedFlowRate1);
        
        props.setTotalFlowA(a => a - (props.positions[props.editingPosition].flowA));
        props.setTotalFlowB(b => b - (props.positions[props.editingPosition].flowB));

        const nextPositions = props.positions.map((p, i) => {
            if (props.editingPosition == i) {
                return {
                    ...p,
                    balanceA: (p.balanceA - (p.flowA * (props.time - p.initialTimestampA)) + (p.flowB * (props.cumulativeB - p.initialCumulativeB))),
                    balanceB: (p.balanceB - (p.flowB * (props.time - p.initialTimestampB)) + (p.flowA * (props.cumulativeA - p.initialCumulativeA))),
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
            className='w-96 p-8 bg-white shadow-2xl rounded-3xl border-2 space-y-2'
            onSubmit={submit}
        >
            <div className='flex pb-8'>
                <p className='flex grow'>
                    LP
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
                FlowRates
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
            </div>
            <div className='flex space-x-2 items-center'> 
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
            </div>
        </form>
    )
}

export default EditLp;