export const getStageTitle = (stage) => {
  const stageTitles = {
    collection: 'Collection',
    result: 'Result Entry',
    authorization: 'Authorization',
  };
  return stageTitles[stage] || 'Workflow';
};

export const formatParametersForSave = (parameters) => {
  return parameters.filter(param => param?.value);
};

export const prepareTestParameters = (parameters) => {
  return parameters?.map(param => ({
    ...param,
    value: param?.value || param?.currentResult?.value || '',
  })) || [];
};

export const validateTestSelection = (selectedTests, stage) => {
  if (selectedTests.length === 0) {
    return {
      isValid: false,
      message: `Please select at least one test to ${stage === 'collection' ? 'collect' : 'process'}`,
    };
  }
  return { isValid: true };
};