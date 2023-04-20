import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { NextPage } from 'next'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import CreateTreeModal from '@/components/CreateTreeModal'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}




const statuses = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
    Preview: 'text-gray-400 bg-gray-600/30 ring-gray-700',
    Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}

const ViewWallet: NextPage = () => {
    const [open, setOpen] = useState(false)
    const [wallet, setWallet] = useState({ balance: 0, id:0 })

    const router = useRouter()
    const { address } = router.query


    useMemo(async () => {
        const wallets = await fetch('/api/wallets')
        const _wallets = await wallets.json()
        const wallet = _wallets.wallets.filter((w: any) => w.publicKey == address)
        console.log("found a wallet?")
        console.log(wallet)
        if (wallet.length != 0)
            setWallet(wallet[0])
    }, [address])


    return (
        <div>
            <Head>
                <title></title>
                <meta name='description' content='' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <CreateTreeModal open={open} setOpen={setOpen} />

            <header className="flex items-center border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <a onClick={() => router.back()}>
                    <ChevronLeftIcon className='w-6 inline' />
                    <h1 className="text-base font-semibold inline leading-7 text-white">{address}</h1>
                </a>

            </header>

            <p>Balance: {wallet.balance} sol</p>
            <button
                type="button"
                className="rounded-md bg-indigo-500 mr-2 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => {
                    toast("Requesting Airdrop")
                    fetch('/api/airdrop', {
                        method: 'POST',
                        body: JSON.stringify({
                            address: address,
                            id: wallet.id
                        })
                    }).catch(()=>{
                        toast("Request Unsuccessful")
                    }).then(()=>{
                        toast("Request Successful, +1 sol")
                        let _wallet = wallet 
                        _wallet.balance += 1
                        setWallet(_wallet)
                    })
                }}
            >
                Airdrop 1 sol
            </button>

            <button
                type="button"
                className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => {
                    fetch('/api/wallet/delete', {
                        method: 'POST',
                        body: JSON.stringify({
                            address: address,
                            id: wallet.id
                        })
                    }).then(()=>{
                        router.back()
                    })
                }}
            >
                Delete Wallet
            </button>


        </div>
    )
}


export default ViewWallet
