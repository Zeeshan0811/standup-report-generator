import React from 'react'
import Head from 'next/head';
import Header from "/components/Header";
import Footer from "/components/Footer";

const LayoutMain = ({ children }) => {
    return (
        <>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>JB Suite | Productivity Tools</title>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
                />
            </Head>
            <Header />
            <div className="container-fluid py-4">
                <main>{children}</main>
                <Footer />
                {/* Bootstrap JS  */}
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                {/* Bootstrap Icons  */}
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"></link>
            </div>

        </>
    )
}

export default LayoutMain