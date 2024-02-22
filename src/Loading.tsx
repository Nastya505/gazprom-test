import React from 'react';
import ReactLoading from 'react-loading';

interface IProps {
    type: any;
    color: string;
}

const Loading = ({ type, color }: IProps) => (
    <ReactLoading type={type} color={color} height={'40px'} width={'40px'} className="loading" />
);
 
export default Loading;