import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterChip } from '../FilterChip';

// Mocking icons to avoid rendering issues in tests
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

describe('FilterChip', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(
      <FilterChip label="Restaurantes" icon="silverware-fork-knife" active={false} onPress={() => {}} />
    );
    expect(getByText('Restaurantes')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <FilterChip label="Click Me" icon="help-circle" active={false} onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when active', () => {
    const { getByText } = render(
      <FilterChip 
        label="Active" 
        icon="check"
        active={true} 
        onPress={() => {}} 
      />
    );
    
    expect(getByText('Active')).toBeTruthy();
  });
});
