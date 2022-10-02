import React, { useState, useEffect } from 'react';
import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";


export default function ChooseProjectModal({
	show,
	onHide,
	grantId,

}) {

	const [list, setList] = useState([]);
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}



	async function fetchContractData() {
		try {
			if (window.nearcontract) {

				const AllEvents = JSON.parse(await window.nearcontract.get_all_events_from_wallet({wallet: window.accountId}));  
				const arr = [];
				for (let i = 0; i < AllEvents.length; i++) {
					const value = AllEvents[i];
					const eventid =Number( await window.nearcontract.get_eventid_from_eventuri({event_uri: value}));
					const ISsubmitted = await window.nearcontract.check_submitted_project_grant({grant_id:Number(grantId),project_id:Number(eventid)})
					if (value) {
						const object = JSON.parse(value);
						var c = new Date(object.properties.Date.description).getTime();
							var n = new Date().getTime();
							var d = c - n;
							var s = Math.floor((d % (1000 * 60)) / 1000);
							if (s.toString().includes("-")) {
								continue;
							}
							arr.push({
								eventId: eventid,
								Title: object.properties.Title.description,
								Date: object.properties.Date.description,
								Goal: object.properties.Goal.description,
								logo: object.properties.logo.description.url,
								isSubmitted: ISsubmitted
							});
					}
				}
				setList(arr);
			}
		} catch (error) {
			console.error(error);
		}
	}
    useEffect(()=>{fetchContractData();},[show]);

	async function choosenProject(id) {
		await window.nearcontract.create_grant_project({"grant_id":Number(grantId), "project_id":Number(id)}, "60000000000000");
	}


	return (
		<Dialog
			isOpen={show}
			onDismiss={onHide}
			maxWidth="800px"
			variant='new'
			position="CENTER"
			hideCloseButton
            heading={
                <Header
                  closeButton={
                    <ControlsClose
                      className="text-moon-24 text-trunks"
                      onClick={onHide}
                    />
                  }
                  isDivider={true}
                >
                 Choose project
                </Header>
              }
		>
			
			<div className="flex-auto p-4 relative">
				<div className='flex flex-row flex-wrap gap-2'>
					{list.map((item, i) => {
						return <>
							<div onClick={()=>{if (item.isSubmitted != true){choosenProject(item.eventId)}}} className={"h-48 w-48"} >
								<div className={(item.isSubmitted != true)?("rounded border-solid border inline-grid items-center content-center justify-items-center justify-center h-full select-none w-full border-[#d1d5db] cursor-pointer hover:bg-[#e2e8f0]"):("bg-[#d1d5db] rounded cursor-default inline-grid items-center content-center justify-items-center justify-center h-full select-none w-full")}>
									<img
										className="Event-Uploaded-File-clip-icon"
										src={item.logo}
										style={{ width: "90%", height: "90%" }}
									/>
									<span className="Event-Uploaded-File-name" >
										{item.Title.substring(0, 20)}...
									</span>
								</div>
							</div>
						</>
					})}
				</div>
			</div>

		</Dialog>

	);
}