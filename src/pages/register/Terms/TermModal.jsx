import { useMemo } from "react";
import { Link } from "react-router-dom";

const TermModal = ({ title, description, link }) => {

    return (
        <div className="border rounded p-5 border-[#E0E0E0] mx-4 mb-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
            </div>
            <p className="text-sm text-gray-700">{description}</p>
            {
                link && (
                    <Link to={link}>
                        <span className="bg-[#d0f3ff]">Ver más</span>
                    </Link>
                )
            }
            <div className="flex justify-end">

            </div>
        </div>
    );
};

export default TermModal;