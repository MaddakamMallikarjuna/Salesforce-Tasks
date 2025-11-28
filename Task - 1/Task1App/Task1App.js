import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Task1App extends LightningElement {
    @track feild = 'NAME';
    searchKey;
    @api searchkeyValue;
    @api feildValue;
    options = [
        { label: 'Name', value: 'NAME' },
        { label: 'Email', value: 'EMAIL' },
        { label: 'Phone', value: 'PHONE' }
    ];

    handleSearch(){
        this.searchkeyValue = this.searchKey;
        this.feildValue = this.feild;
    }

    handleSearchKeyChange(event) {
        if(event.target.value.length > 1) {
            this.searchKey = event.target.value;
        }
        else if(event.target.value.length == 0){
            this.searchKey = null;
        }
        else {
            this.dispatchEvent(
                    new ShowToastEvent({
                        title: '',
                        message: 'Enter atleast 2 characters',
                        variant: 'warning'
                    })
                );
            }
        }

    handleFeildChange(event) {
        this.feild = event.target.value;
    }
}
