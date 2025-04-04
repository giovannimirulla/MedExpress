import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Meta from 'antd/lib/card/Meta';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';

import { Drug } from '@/types/Drug';
import DynamicDrugIcon from './DynamicDrugIcon';

//props key and drug
interface CardDrugProps {
    key: number;
    showModel: (drug: Drug) => void;
    drug: Drug;
}

const CardDrug: React.FC<CardDrugProps> = ({ drug, showModel }) => {
    return (
        <Card
            title={<h2 className="text-lg font-bold text-gray-800">{drug.medicinale.denominazioneMedicinale}</h2>}
            variant="borderless"
            className="shadow-lg rounded-lg border border-gray-200"
            actions={[
                <div
                    key={drug.medicinale.denominazioneMedicinale}
                    className="w-full h-full text-center text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => showModel(drug)}
                >
                    <FontAwesomeIcon icon={faTruckFast} /> Ordina
                </div>
            ]}
        >
            <Meta
                avatar={
                    <DynamicDrugIcon drug={drug} />
                }
                title={<p className="text-sm text-gray-500 italic">{drug.descrizioneFormaDosaggio}</p>}
                description={<>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start text-gray-700">
                        {/* Somministrazione */}
                        <p className="font-semibold">Somministrazione:</p>
                        <ul className="list-disc pl-6 col-span-2 text-sm">
                            {drug.vieSomministrazione.map((viaSomministrazione: string, index: number) => (
                                <li key={index}>{viaSomministrazione}</li>
                            ))}
                        </ul>

                        {/* Dosaggio */}
                        <p className="font-semibold">Dosaggio:</p>
                        <p className="text-right">{drug.descrizioneFormaDosaggio}</p>
                    </div>

                    {/* Principi attivi */}
                    <div className="text-gray-700">
                        <p className="font-semibold col-span-2 ">Principi attivi:</p>
                        <ul className="list-disc pl-6 col-span-2 text-sm">
                            {drug.principiAttiviIt.map((principio: string, index: number) => (
                                <li key={index}>{principio}</li>
                            ))}
                        </ul>
                    </div>
                </>}

            />
        </Card>
    );
};

export default CardDrug;