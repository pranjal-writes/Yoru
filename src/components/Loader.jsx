import { BarLoader } from "react-spinners";

// Loader
export default function Loader() {
    return (
        <>
            <div className=" bg-black flex items-center flex-col gap-5 justify-center h-screen text-xl text-[#7FE0C7]">
                <BarLoader color="#7FE0C7" />
                <h2>Loading Experience</h2>
            </div>
        </>
    );
}
