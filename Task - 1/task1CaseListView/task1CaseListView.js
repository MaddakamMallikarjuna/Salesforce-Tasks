import { LightningElement, api, wire, track } from 'lwc';
import getCaseRecordsByKey from '@salesforce/apex/Task1Helper.getCaseRecordsByKey';

export default class Task1CaseListView extends LightningElement {
    
    @api searchKey = '';
    @api feild = '';
    data;
    error;

    @track paginatedData = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    columns = [
        { label: 'Case Number', fieldName: 'caseUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'CaseNumber' }, target: '_blank' }
        },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Email', fieldName: 'ContactEmail', type: 'email' }        
    ];

    connectedCallback(){
        this.searchKey = null;
        this.feild = 'NAME';
    }
    
    @wire(getCaseRecordsByKey, { feildName: '$feild', searchKey: '$searchKey' })
    wiredContacts({ data, error }) {
        if (data) {
            this.data = data.map(cs => {
                return {
                        ...cs,
                        caseUrl: '/' + cs.Id
                    }
            });
            this.totalPages = Math.ceil(data.length / this.pageSize);
            this.updatePaginatedData();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

     updatePaginatedData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.data.slice(start, end);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedData();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedData();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }
}
