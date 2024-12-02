import axios from 'axios';
import React, { useState } from 'react';

const AddReport: React.FC = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const handleAddReport = async () => {
        try {
            const response = await axios.post('/reports', {
                data_inicio: dataInicio,
                data_fim: dataFim
            });
            alert(`Relatório adicionado com sucesso. ID: ${response.data.id}`);
        } catch (error) {
            console.error('Erro ao adicionar relatório', error);
            alert('Erro ao adicionar relatório');
        }
    };

    return (
        <div>
            <h1>Adicionar Novo Relatório</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddReport();
                }}
            >
                <label>
                    Data de Início:
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Data de Fim:
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Adicionar Relatório</button>
            </form>
        </div>
    );
};

export default AddReport;
