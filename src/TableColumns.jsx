import React from 'react';
import Table from './components/Table';
import AddEntryModal from './components/AddEntryModal';
import initialData from './data.json';

function TableColumns() {
    // Initialize state from localStorage or fallback to initialData
    const [data, setData] = React.useState(() => {
        const saved = localStorage.getItem('table-data');
        return saved ? JSON.parse(saved) : initialData;
    });

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Save to localStorage whenever data changes
    React.useEffect(() => {
        localStorage.setItem('table-data', JSON.stringify(data));
    }, [data]);

    React.useEffect(() => {
        const today = new Date().toLocaleDateString();
        const lastReset = localStorage.getItem('last-reset-date');

        if (lastReset !== today) {
            setData(prevData => {
                const newData = prevData.map(row => ({
                    ...row,
                    dailyCheck: "No"
                }));
                return newData;
            });

            localStorage.setItem('last-reset-date', today);
        }
    }, []);

    // Helper to calculate overdue days
    const calculateOverdue = (dateStr) => {
        if (!dateStr) return { text: "No Date", className: "overdue-block deadline-green" }; // Default green or neutral?

        const [day, month, year] = dateStr.split('/');
        // Check if date is valid
        if (!day || !month || !year) return { text: dateStr, className: "overdue-block deadline-green" };

        const targetDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        // Reset time for accurate day comparison
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: `Overdue by ${Math.abs(diffDays)} days`,
                className: "overdue-block overdue-red"
            };
        } else if (diffDays === 0) {
            return {
                text: `Deadline Today`,
                className: "overdue-block deadline-green"
            };
        } else {
            return {
                text: `Deadline in ${diffDays} days`,
                className: "overdue-block deadline-green"
            };
        }
    };

    // Function to handle adding a new row
    const handleSaveEntry = (newEntry) => {
        // Add to state (this updates the UI instantly)
        setData([...data, newEntry]);

        // NOTE: We cannot write to the physical file system from the browser.
        // In a real app, you would send a POST request to a backend API here.
        console.log("New Entry Added:", newEntry);
    };

    // Date Helpers
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const formatDateFromInput = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    // Generic handler for all fields
    const handleDataChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index][field] = value;
        setData(updatedData);
    };

    const columns = [

        {
            header: 'Project',
            accessor: 'project',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="project" style={{ display: 'none' }}>Project</label>
                    <input
                        type="text"
                        id='project'
                        value={row.project}
                        onChange={(e) => handleDataChange(rowIndex, 'project', e.target.value)}
                        className="project-text"
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                    />
                </>
            )
        },
        {
            header: 'Daily Check',
            accessor: 'dailyCheck',
            cellClassName: 'daily-check-td',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="dailyCheck" style={{ display: 'none' }}>Daily Check</label>
                    <select
                        value={row.dailyCheck}
                        id='dailyCheck'
                        onChange={(e) => handleDataChange(rowIndex, 'dailyCheck', e.target.value)}
                        className="daily-check-cell"
                        style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', outline: 'none', height: '100%' }}
                    >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </>
            )
        },
        {
            header: 'TL Comments',
            accessor: 'tlComments',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="tlComments" style={{ display: 'none' }}>TL Comments</label>
                    <input
                        id='tlComments'
                        type="text"
                        value={row.tlComments}
                        onChange={(e) => handleDataChange(rowIndex, 'tlComments', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                    />
                </>
            )
        },
        { header: 'Columns 4', accessor: 'columns4' },
        {
            header: 'Overdue Days',
            accessor: 'endDate',
            render: (row) => {
                const { text, className } = calculateOverdue(row.endDate);
                return <div className={className}>{text}</div>;
            }
        },
        {
            header: 'Group',
            accessor: 'group',
            render: (row, rowIndex) => {
                let className = 'group-block';
                const currentGroup = row.group;
                if (currentGroup === 'Group C') className += ' group-c';
                else if (currentGroup === 'Group D') className += ' group-d';
                else if (currentGroup === 'Group B') className += ' group-b';
                else if (currentGroup === 'Group A') className += ' group-a';

                return (
                    <>
                        <label htmlFor="group" style={{ display: 'none' }}>Group</label>
                        <select
                            id='group'
                            className={className}
                            value={currentGroup}
                            onChange={(e) => handleDataChange(rowIndex, 'group', e.target.value)}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="Group A">Group A</option>
                            <option value="Group B">Group B</option>
                            <option value="Group C">Group C</option>
                            <option value="Group D">Group D</option>
                            <option value="Group E">Group E</option>
                        </select>
                    </>
                );
            }
        },
        {
            header: 'Category',
            accessor: 'category',
            render: (row, rowIndex) => {
                let className = 'category-cell';
                if (row.category.toLowerCase().includes('shopify')) className += ' category-shopify';
                else if (row.category.toLowerCase().includes('custlo')) className += ' category-custlo';
                else if (row.category.toLowerCase().includes('trouble')) className += ' category-troubleshoot';
                else if (row.category.toLowerCase().includes('redesign')) className += ' category-redesign';

                return (
                    <>
                        <label htmlFor="category" style={{ display: 'none' }}>Category</label>
                        <select
                            id='category'
                            className={className}
                            value={row.category}
                            onChange={(e) => handleDataChange(rowIndex, 'category', e.target.value)}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none', width: '100%' }}
                        >
                            <option value="Redesign/Theme update">Redesign/Theme update</option>
                            <option value="Troubleshoot">Troubleshoot</option>
                            <option value="Theme Customization">Theme Customization</option>
                            <option value="CRO Changes">CRO Changes</option>
                            <option value="Graphics">Graphics</option>
                            <option value="Audit">Audit</option>
                            <option value="Seo">Seo</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Speed Optimization">Speed Optimization</option>
                            <option value="Wordpress">Wordpress</option>
                            <option value="Shopify Plus">Shopify Plus</option>
                            <option value="Monthly Maintaining">Monthly Maintaining</option>
                            <option value="Custlo App">Custlo App</option>
                        </select>
                    </>
                );
            }
        },
        {
            header: 'Team Lead',
            accessor: 'teamLead',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="teamLead" style={{ display: 'none' }}>Team Lead</label>
                    <select
                        id='teamLead'
                        value={row.teamLead}
                        onChange={(e) => handleDataChange(rowIndex, 'teamLead', e.target.value)}
                        className="team-lead-text"
                        style={{ border: 'none', cursor: 'pointer', outline: 'none', background: 'transparent' }}
                    >
                        <option value="Nikhil Joshi">Nikhil Joshi</option>
                        <option value="Komal Mankani">Komal Mankani</option>
                        <option value="Aditya">Aditya</option>
                        <option value="Shubham">Shubham</option>
                        <option value="Arun">Arun</option>
                        <option value="Vibha">Vibha</option>
                        <option value="Sunil">Sunil</option>
                    </select>
                </>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row, rowIndex) => {
                let className = 'status-text';
                if (row.status === 'Not started') className += ' status-not-started';
                else if (row.status === 'ON TRACK') className += ' status-on-track';
                else if (row.status.includes('Offtrack')) className += ' status-offtrack';
                else className += ' status-forwarded';

                return (
                    <>
                        <label htmlFor="status" style={{ display: 'none' }}>Status</label>
                        <select
                            id='status'
                            value={row.status}
                            onChange={(e) => handleDataChange(rowIndex, 'status', e.target.value)}
                            className={className}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none', background: 'transparent' }}
                        >
                            <option value="Not started">Not started</option>
                            <option value="ON TRACK">ON TRACK</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Off Track">Off Track</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Rating">Rating</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Forwarded to Client">Forwarded to Client</option>
                            <option value="Rating Requested">Rating Requested</option>
                            <option value="Risky Completed">Risky Completed</option>
                            <option value="Offtrack Client">Offtrack Client</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Confirmation Pending">Confirmation Pending</option>
                        </select>
                    </>
                );
            }
        },
        {
            header: 'Team lead discussion',
            accessor: 'discussion',
            render: (row, rowIndex) => {
                let className = 'discussion-text';
                return (
                    <>
                        <label htmlFor="discussion" style={{ display: 'none' }}>Team lead discussion</label>
                        <select
                            id='discussion'
                            value={row.discussion}
                            onChange={(e) => handleDataChange(rowIndex, 'discussion', e.target.value)}
                            className={className}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none', background: 'transparent', maxWidth: '120px' }}
                        >
                            <option value="No group">No group</option>
                            <option value="On Whatsapp">On Whatsapp</option>
                            <option value="On Email">On Email</option>
                            <option value="skype">Skype</option>
                            <option value="Slack">Slack</option>
                            <option value="Aisensy">Aisensy</option>
                        </select>
                    </>
                );
            }
        },
        {
            header: 'Start Date',
            accessor: 'startDate',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="startDate" style={{ display: 'none' }}>Start Date</label>
                    <input
                        type="date"
                        id='startDate'
                        value={formatDateForInput(row.startDate)}
                        onChange={(e) => handleDataChange(rowIndex, 'startDate', formatDateFromInput(e.target.value))}
                        style={{ border: 'none', background: 'transparent', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'End Date',
            accessor: 'endDate',
            render: (row, rowIndex) => {
                const isUrgent = row.endDate === '04/10/2025';
                return (
                    <>
                        <label htmlFor='endDate' style={{ display: 'none' }}>End Date</label>
                        <input
                            type="date"
                            id='endDate'
                            value={formatDateForInput(row.endDate)}
                            onChange={(e) => handleDataChange(rowIndex, 'endDate', formatDateFromInput(e.target.value))}
                            className={isUrgent ? 'date-highlight-red' : ''}
                            style={{ border: 'none', background: 'transparent', fontFamily: 'inherit', color: isUrgent ? 'white' : 'inherit' }}
                        />
                    </>
                );
            }
        },
        {
            header: 'Project Manager',
            accessor: 'projectManager',
            render: (row, rowIndex) => {
                let className = 'project_manager';
                return (
                    <>
                        <label htmlFor='projectManager' style={{ display: 'none' }}>Project Manager</label>
                        <select
                            value={row.projectManager}
                            id='projectManager'
                            onChange={(e) => handleDataChange(rowIndex, 'projectManager', e.target.value)}
                            className={className}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none', background: 'transparent', maxWidth: '120px' }}
                        >
                            <option value="Komal">Komal</option>
                            <option value="Pankaj">Pankaj</option>
                            <option value="Rahul">Rahul</option>
                            <option value="Khanak">Khanak</option>
                            <option value="Shubham">Shubham</option>
                            <option value="Kajal">Kajal</option>
                        </select>

                    </>
                );
            }
        },
        {
            header: 'Client',
            accessor: 'client',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="client" style={{ display: 'none' }}>Client</label>
                    <input
                        type="text"
                        id='client'
                        value={row.client}
                        onChange={(e) => handleDataChange(rowIndex, 'client', e.target.value)}
                        className="client-text"
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                    />
                </>
            )
        },
        {
            header: 'Sales Discussion',
            accessor: 'salesDiscussion',
            render: (row, rowIndex) => {
                let className = 'sales-discussion';
                return (
                    <>
                        <label htmlFor="salesDiscussion" style={{ display: 'none' }}>Sales Discussion</label>
                        <select
                            id='salesDiscussion'
                            value={row.salesDiscussion}
                            onChange={(e) => handleDataChange(rowIndex, 'salesDiscussion', e.target.value)}
                            className={className}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none', background: 'transparent', maxWidth: '120px' }}
                        >
                            <option value="Email">Email</option>
                            <option value="Whatsapp">Whatsapp</option>
                            <option value="Slack">Slack</option>
                        </select>
                    </>
                );
            }
        },
        {
            header: 'Month',
            accessor: 'monthYear',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="monthYear" style={{ display: 'none' }}>Month</label>
                    <input
                        type="month"
                        id='monthYear'
                        value={row.monthYear}
                        onChange={(e) => handleDataChange(rowIndex, 'monthYear', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'Rating Status',
            accessor: 'ratingStatus',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="ratingStatus" style={{ display: 'none' }}>Rating Status</label>
                    <input
                        type="text"
                        id='ratingStatus'
                        value={row.ratingStatus}
                        onChange={(e) => handleDataChange(rowIndex, 'ratingStatus', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'Final Invoice Pending',
            accessor: 'finalInvoicePending',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="finalInvoicePending" style={{ display: 'none' }}>Final Invoice Pending</label>
                    <input
                        type="text"
                        id='finalInvoicePending'
                        value={row.finalInvoicePending}
                        onChange={(e) => handleDataChange(rowIndex, 'finalInvoicePending', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'Rating Requested',
            accessor: 'ratingRequested',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="ratingRequested" style={{ display: 'none' }}>Rating Requested</label>
                    <input
                        type="text"
                        id='ratingRequested'
                        value={row.ratingRequested}
                        onChange={(e) => handleDataChange(rowIndex, 'ratingRequested', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'Client Satisfaction',
            accessor: 'clientSatisfaction',
            render: (row, rowIndex) => (
                <>
                    <label htmlFor="clientSatisfaction" style={{ display: 'none' }}>Client Satisfaction</label>
                    <input
                        type="text"
                        id='clientSatisfaction'
                        value={row.clientSatisfaction}
                        onChange={(e) => handleDataChange(rowIndex, 'clientSatisfaction', e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                </>
            )
        },
        {
            header: 'Priority',
            accessor: 'priority',
            render: (row, rowIndex) => {
                let className = 'priority-cell';
                return (
                    <>
                        <label htmlFor="priority" style={{ display: 'none' }}>Priority</label>
                        <input
                            type="text"
                            id='priority'
                            value={row.priority}
                            onChange={(e) => handleDataChange(rowIndex, 'priority', e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                        />
                    </>
                );
            }
        },
    ];


    // Data is now managed in state initialized from JSON

    return (
        <div className='project-list'>
            <h1>Projects List</h1>
            <Table columns={columns} data={data} />
            <button className="add-more-button" onClick={() => setIsModalOpen(true)}>Add more</button>

            <AddEntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEntry}
            />
        </div>
    );
}

export default TableColumns;
