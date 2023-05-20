export const checkAuthorityFunction = (rFunctionConditions, functionCode) => {
  const isExistFunctionCondition = rFunctionConditions && rFunctionConditions.find(functionCondition => {
    return functionCondition?.m_function && functionCondition?.m_function?.code === functionCode;
  });
  
  return !!isExistFunctionCondition;
};