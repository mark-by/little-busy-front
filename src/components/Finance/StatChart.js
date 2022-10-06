import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function StatChart({data}) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={data} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="incomes" stroke="#37D67A" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="incomes_planned" stroke="#0000FF" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="costs" stroke="#F47373" />
            </LineChart>
        </ResponsiveContainer>
    )
}
