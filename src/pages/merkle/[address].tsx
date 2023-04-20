import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import CreateTreeModal from '@/components/CreateTreeModal'
import { useRouter } from 'next/router'

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

const ViewMerkle: NextPage = () => {
    const [open, setOpen] = useState(false)
    const [deployments, setDeployments] = useState([
        {
            id: 1,
            href: '#',
            projectName: 'ios-app',
            teamName: 'Planetaria',
            status: 'offline',
            statusText: 'Initiated 1m 32s ago',
            description: 'Deploys from GitHub',
            environment: 'Preview',
        },
        {
            id: 1,
            href: '#',
            projectName: 'ios-app',
            teamName: 'Planetaria',
            status: 'offline',
            statusText: 'Initiated 1m 32s ago',
            description: 'Deploys from GitHub',
            environment: 'Preview',
        }
    ])


    const router = useRouter()
    const {address} = router.query


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
                <ChevronLeftIcon className='w-6 inline'/>
                <h1 className="text-base font-semibold inline leading-7 text-white">{address}</h1>
                </a>

            </header>

           <h1>Tree details go here</h1>


        </div>
    )
}


export default ViewMerkle
