function WhiteKey() {
    return (
        <>
        <div className="w-1/8 h-full bg-white divide-black border border-black transition-colors hover:bg-slate-200">
            
        </div>
        </>
    );
}

function BlackKey() {
    return (
        <>
        <div className="w-1/8 h-2/3 bg-black transition-colors hover:bg-gray-700"></div>
        </>
    );
}

export default function PianoKeyboard() {
    let whiteKeys = [];
    let blackKeys = [];

    for (let i = 0; i < 8; i++) {
        whiteKeys.push(<WhiteKey/>)
    }

    for (let i = 0; i < 6; i++) {
        blackKeys.push(<BlackKey/>)
    }
    return (
        <>
        <div className="w-125 bg-slate-200 h-50 border border-black p-2">

            <div className="flex h-full">
                <div className="flex absolute w-125 h-full z-0">
                {blackKeys}
                </div>
                <div className="flex w-full z-10">
                {whiteKeys}
                </div>
            </div>
        </div>
        </>
    );
}