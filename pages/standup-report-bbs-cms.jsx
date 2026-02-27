import React from 'react'
import StandUpReportGenerator from "/components/StandUpReportGenerator";

const standup_report_bbs_cms = () => {
    const nameOrder = [
        "Zeeshan",
        "Md. Kamrul Haque",
        "Athiqul Hasan Momin ",
        "Muhiminul ( Apon )",
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