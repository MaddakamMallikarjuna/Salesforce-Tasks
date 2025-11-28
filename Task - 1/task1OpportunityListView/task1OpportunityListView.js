import { LightningElement, api, wire, track } from 'lwc';
import getOpportunityRecordsByKey from '@salesforce/apex/Task1Helper.getOpportunityRecordsByKey';

export default class Task1OpportunityListView extends LightningElement {
    @api searchKey = '';
    @api feild = '';
    data;
    error;

    @track paginatedData = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    columns = [
        { label: 'Name', fieldName: 'opportunityUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
        },
        { label: 'Account Name', fieldName: 'accountUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'AccountName' }, target: '_blank' }
        },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Stage Name', fieldName: 'StageName', type: 'text' }
     
    ];

    connectedCallback(){
        this.searchKey = null;
        this.feild = 'NAME';
    }
    
    @wire(getOpportunityRecordsByKey, { feildName: '$feild', searchKey: '$searchKey' })
    wiredContacts({ data, error }) {
        if (data) {
            this.data = data.map(opportunity => {
                return {
                        ...opportunity,
                        opportunityUrl: '/' + opportunity.Id,
                        accountUrl: opportunity.AccountId ? '/' + opportunity.AccountId : null,
                        AccountName: opportunity.Account ? opportunity.Account.Name : ''
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