import React from 'react'
import StandUpReportGenerator from "/components/StandUpReportGenerator";

const standup_report_bbs_cms = () => {
    const nameOrder = [
        "Zeeshan",
        "Muhiminul ( Apon )",
        "Md. Kamrul Haque",
        "Athiqul",
        "Farhan Mullick",
        "Md. Anik Rahman",
    ];

    return (
        <>
            <StandUpReportGenerator type="bbs-cms" name_list={nameOrder} />
        </>
    )
}

export default standup_report_bbs_cms