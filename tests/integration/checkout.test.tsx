import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketplaceCheckout from '../../src/pages/marketplace-checkout';
import { BrowserRouter } from 'react-router-dom';
import { useMutation, useQuery, useAction } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';

jest.mock('convex/react');
jest.mock('@clerk/clerk-react');

const mockCreate = jest.fn();

(useMutation as jest.Mock).mockImplementation((fn) => {
  if (fn === api.marketplace.createOrder) return mockCreate;
  return () => {};
});
(useQuery as jest.Mock).mockReturnValue(null);
(useAction as jest.Mock).mockReturnValue(jest.fn());
(useUser as jest.Mock).mockReturnValue({ user: { id: '1' } });

describe('Marketplace checkout', () => {
  it('submits order', async () => {
    render(
      <BrowserRouter>
        <MarketplaceCheckout />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/Nama Lengkap/i), 'A');
    await userEvent.type(screen.getByLabelText(/No. Telepon/i), '1');
    await userEvent.type(screen.getByLabelText(/Alamat Lengkap/i), 'addr');
    await userEvent.type(screen.getByLabelText(/Kota/i), 'c');
    await userEvent.type(screen.getByLabelText(/Kode Pos/i), '1');
    await userEvent.type(screen.getByLabelText(/Provinsi/i), 'x');
    await userEvent.click(screen.getByText(/Buat Order/i));

    expect(mockCreate).toHaveBeenCalled();
  });
});
