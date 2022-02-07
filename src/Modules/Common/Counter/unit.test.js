import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent, waitFor, cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import '^/globals.js'

import Counter from '%/Common/Counter'

describe('Counter Tests', () => {
  test('<Counter /> Initial', async () => {
    const cStringsMock = jest.fn().mockReturnValue({
      up: "+",
      down: "-",
      reset: "Reset",
    });

    const controllerMock = jest.fn().mockImplementation(() => ({
      min: 10, max: 100, step: 1,
      onStepUp: ()=>{}, onStepDown: ()=>{}, onReset: ()=>{},
      isUpDisabled: false, isDownDisabled: true, cStep: 1,
    }));

    const {debug, getByText} = render(<Counter range={[10, 100]} step={1} using={controllerMock} cStrings={cStringsMock()} />);

    await waitFor(() => {
      //debug();
      expect(getByText('-').closest('button')).toHaveAttribute('disabled');
      expect(getByText('+').closest('button')).not.toHaveAttribute('disabled');
      expect(getByText(/reset/i).closest('button')).toHaveAttribute('disabled');
    })
  });

  test("<Counter /> Increment", async () => {
    const {getByText} = render(<Counter range={[10, 100]} step={5} />);
    fireEvent.click(getByText('+'))
    await waitFor(() => {
      expect(getByText('15')).toBeInTheDocument();
    });
    fireEvent.click(getByText('+'))
    await waitFor(() => {
      expect(getByText('20')).toBeInTheDocument();
    });
  });

  test("<Counter /> Decrement", async () => {
    const {getByText} = render(<Counter range={[10, 100]} step={1} />);
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('-'))
    await waitFor(() => {
      expect(getByText('12')).toBeInTheDocument();
    });
  })

  test("<Counter /> Reset", async () => {
    const {getByText} = render(<Counter range={[10, 100]} step={1} />);
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    await waitFor(() => {
      expect(getByText('12')).toBeInTheDocument();
    });
    fireEvent.click(getByText(/reset/i))
    await waitFor(() => {
      expect(getByText('10')).toBeInTheDocument();
    });
  });
})
