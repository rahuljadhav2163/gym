import React from 'react';
import { View } from 'react-native';
import { Svg, Circle, Line, Text as SvgText } from 'react-native-svg';

const GymChart = () => {
    return (
        <Svg height="150" width="300">
           
            <Line x1="30" y1="10" x2="30" y2="130" stroke="black" strokeWidth="2" />
            <Line x1="30" y1="130" x2="280" y2="130" stroke="black" strokeWidth="2" />

            {/* Chart Data Points */}
            <Circle cx="50" cy="110" r="5" fill="blue" />
            <Circle cx="100" cy="90" r="5" fill="blue" />
            <Circle cx="150" cy="70" r="5" fill="blue" />
            <Circle cx="200" cy="50" r="5" fill="blue" />

            {/* Data Point Lines */}
            <Line x1="50" y1="110" x2="100" y2="90" stroke="blue" strokeWidth="2" />
            <Line x1="100" y1="90" x2="150" y2="70" stroke="blue" strokeWidth="2" />
            <Line x1="150" y1="70" x2="200" y2="50" stroke="blue" strokeWidth="2" />

            {/* Labels */}
            <SvgText x="50" y="140" fontSize="12" fill="black">Day 1</SvgText>
            <SvgText x="100" y="140" fontSize="12" fill="black">Day 2</SvgText>
            <SvgText x="150" y="140" fontSize="12" fill="black">Day 3</SvgText>
            <SvgText x="200" y="140" fontSize="12" fill="black">Day 4</SvgText>

            <SvgText x="5" y="110" fontSize="12" fill="black">50kg</SvgText>
            <SvgText x="5" y="90" fontSize="12" fill="black">60kg</SvgText>
            <SvgText x="5" y="70" fontSize="12" fill="black">70kg</SvgText>
            <SvgText x="5" y="50" fontSize="12" fill="black">80kg</SvgText>
        </Svg>
    );
};

export default GymChart;
