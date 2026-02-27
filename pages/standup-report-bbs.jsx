import React from 'react'
import StandUpReportGenerator from "/components/StandUpReportGenerator";

const standup_report_bbs = () => {
    const nameOrder = [
        "Shafin Junayed",
        "Shad",
        "Shahriar Ahmed Shawon",
        "Nafis Nawal Nahiyan",
        "Satadip",
        "Naznin",
        "David",
        // "Zeeshan",
        // "Muhiminul ( Apon )",
        "Safwan",
        "Jalish Mahmud",
        "Anisur Rahman (Shahin)",
        "Amin",
        // "Farhan Mullick"
    ];

    return (
        <>
            <StandUpReportGenerator type="bbs" name_list={nameOrder} />
        </>
    )
}

export default standup_report_bbs