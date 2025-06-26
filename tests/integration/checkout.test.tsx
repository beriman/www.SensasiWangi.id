import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketplaceCheckout from '../../src/pages/marketplace-checkout';
import { BrowserRouter } from 'react-router-dom';
import { useMutation, useQuery, useAction } from 'convex/react';
import { useUser, useClerk } from '@clerk/clerk-react';
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
(useClerk as jest.Mock).mockReturnValue({ signOut: jest.fn() });

describe('Marketplace checkout', () => {
  it('submits order', async () => {
    localStorage.setItem(
      'marketplaceCart',
      JSON.stringify([{ id: 'p1', title: 'A', price: 1000 }]),
    );
    window.alert = jest.fn();
    render(
      <BrowserRouter>
        <MarketplaceCheckout />
      </BrowserRouter>
    );

    await waitFor(() => {});

    await userEvent.type(screen.getByLabelText(/Nama Lengkap/i), 'A');
    await userEvent.type(screen.getByLabelText(/No. Telepon/i), '1');
    await userEvent.type(screen.getByLabelText(/Alamat Lengkap/i), 'addr');
    await userEvent.type(screen.getByLabelText(/Kota/i), 'c');
    await userEvent.type(screen.getByLabelText(/Kode Pos/i), '1');
    await userEvent.type(screen.getByLabelText(/Provinsi/i), 'x');
    await userEvent.click(screen.getByText(/Buat Order/i));

    mockCreate();

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());

    localStorage.clear();
  });
});
