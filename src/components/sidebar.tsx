import Image from 'next/image'
import { Transition, Dialog } from '@headlessui/react'
import {
    FolderIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next';
import { PrismaClient } from '@prisma/client'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'



const navigation = [
    { name: 'Index', href: '/', icon: FolderIcon, current: false },
    { name: 'Create Merkle Tree', href: '/merkle', icon: FolderIcon, current: false },
    { name: 'Create Collection', href: '/collection', icon: ServerIcon, current: false },
    { name: 'Airdrop xNFTs', href: '/airdrop', icon: SignalIcon, current: false },
    { name: 'Wallets', href: '/wallets', icon: SignalIcon, current: false },
]


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}


const publishingOptions = [
    { title: 'Published', description: 'This job posting can be viewed by anyone who has the link.', current: true },
    { title: 'Draft', description: 'This job posting will no longer be publicly accessible.', current: false },
]


// index.tsx
export default function Sidebar() {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const [selected, setSelected] = useState(publishingOptions[0])
    const [wallets, setWallets] = useState([])
    const [selectedWallet, setSelectedWallet] = useState(0)


    useEffect(() => {
        fetch('/api/wallets').then((res) => res.json()).then((data) => {
            setWallets(data.wallets)
            // const inUse = data.wallets.filter((w)=>w.selected)
            const idx = data.wallets.findIndex((w: any) => w.selected)
            console.log("wallet in use: ", idx)
            // console.log(inUse)
            setSelectedWallet(data.wallets[idx])
            console.log(data.wallets[idx])
        })
    }, [])


    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <Image
                                            height={32}
                                            width={32}
                                            className="h-8 w-auto"
                                            src="/solana-favicon-32x32.png"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul role="list" className="-mx-2 space-y-1">
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <a
                                                                onClick={() => router.push('/create/merkle')}
                                                                href={item.href}
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-gray-800 text-white'
                                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                            >
                                                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                {item.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>

                                            <li className="-mx-6 mt-auto">
                                                <a
                                                    href="#"
                                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                                >
                                                    <Image
                                                        height={32}
                                                        width={32}
                                                        className="h-8 w-8 rounded-full bg-gray-800"
                                                        src="/solana-favicon-32x32.png"
                                                        alt=""
                                                    />
                                                    <span className="sr-only">Your profile</span>
                                                    <span aria-hidden="true">Tom Cook</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                    <div className="flex h-16 shrink-0 items-center">
                        <Image
                            height={32}
                            width={32}
                            className="h-8 w-auto"
                            src="/solana-favicon-32x32.png"
                            alt="Your Company"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                )}
                                            >
                                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <span
                                    // href="#"
                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                >


                                    <select
                                        id="location"
                                        name="location"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-300 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-800"
                                        defaultValue="mainnet-beta"
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                        }}
                                    >
                                        <option>mainnet-beta</option>
                                        <option>testnet</option>
                                        <option>devnet</option>
                                        <option>custom</option>
                                    </select>



                                </span>
                            </li>
                            {wallets.length > 0 &&
                                <li className="">
                                    <span
                                        // href="#"
                                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                    >
                                        <select
                                            id="wallets"
                                            name="wallets"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-300 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-800"
                                            defaultValue={wallets[selectedWallet]}
                                            onChange={(e) => {
                                                fetch('/api/wallet/selected', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        id: e.target.value
                                                    })
                                                })
                                            }}
                                        >

                                            {wallets.map((w: any) => <option key={w.id} value={w.id}>{w.publicKey}</option>)}
                                        </select>
                                    </span>
                                </li>
                            }
                        </ul>
                    </nav>
                </div>
            </div>

        </>
    )
}