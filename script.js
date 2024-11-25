
class AnimalTable {
    constructor(containerId, data, config) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.config = config;
        this.sortField = null;
        this.sortDirection = 'asc';
        this.render();
    }

    render() {
        const table = `
            <div class="card mb-4">
                <div class="card-header">
                    <h3>${this.config.title}</h3>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            ${this.createHeader()}
                        </thead>
                        <tbody>
                            ${this.createRows()}
                        </tbody>
                    </table>
                    ${this.createAddForm()}
                </div>
            </div>
        `;
        this.container.innerHTML = table;
        this.addEventListeners();
    }

    createHeader() {
        return `
            <tr>
                <th>Image</th>
                <th ${this.isSortable('name') ? 'class="sortable"' : ''}>Name ${this.getSortIndicator('name')}</th>
                <th ${this.isSortable('size') ? 'class="sortable"' : ''}>Size ${this.getSortIndicator('size')}</th>
                <th ${this.isSortable('location') ? 'class="sortable"' : ''}>Location ${this.getSortIndicator('location')}</th>
                <th>Actions</th>
            </tr>
        `;
    }

    getSortIndicator(field) {
        if (this.sortField === field) {
            return this.sortDirection === 'asc' ? '&#8593;' : '&#8595;';
        }
        return '';
    }

    createRows() {
        return this.data.map(animal => `
            <tr>
                <td>
                    <img src="${animal.image}" alt="${animal.name}" 
                        class="animal-image" title="${animal.name}">
                </td>
                <td ${this.getNameStyle()}>${animal.name}</td>
                <td>${animal.size} ft</td>
                <td>${animal.location}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${animal.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${animal.id}">Delete</button>
                    </div>
                    </td>
            </tr>
        `).join('');
    }

    createAddForm() {
        return `
            <form class="add-form mt-3">
                <div class="row">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="name" placeholder="Name" required>
                    </div>
                    <div class="col-md-3">
                        <input type="number" class="form-control" name="size" placeholder="Size" required min="1">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="location" placeholder="Location" required>
                    </div>
                    <div class="col-md-3">
                        <button type="submit" class="btn btn-success">Add Animal</button>
                    </div>
                </div>
            </form>
        `;
    }

    getNameStyle() {
        return '';
    }

    isSortable(field) {
        return this.config.sortableFields.includes(field);
    }

    addEventListeners() {
        this.container.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.textContent.toLowerCase().split(' ')[0];
                this.sort(field);
            });
        });

        this.container.querySelector('.add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAnimal(e.target);
        });

        this.container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteAnimal(btn.dataset.id));
        });

        this.container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.editAnimal(btn.dataset.id));
        });
    }

    sort(field) {
        if (!this.isSortable(field)) return;
        
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        this.data.sort((a, b) => {
            const valueA = a[field].toString().toLowerCase();
            const valueB = b[field].toString().toLowerCase();
            const comparison = valueA.localeCompare(valueB, undefined, {numeric: true});
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });

        this.render();
    }

    addAnimal(form) {
        const formData = new FormData(form);
        const newAnimal = {
            id: Date.now(),
            name: formData.get('name'),
            size: parseFloat(formData.get('size')),
            location: formData.get('location'),
            image: this.getDefaultImage()
        };

        if (this.validateAnimal(newAnimal)) {
            this.data.push(newAnimal);
            this.render();
        }
    }

    validateAnimal(animal) {
        if (this.data.some(a => a.name.toLowerCase() === animal.name.toLowerCase())) {
            alert('Animal with this name already exists!');
            return false;
        }
        if (animal.size <= 0) {
            alert('Size must be greater than 0!');
            return false;
        }
        return true;
    }

    deleteAnimal(id) {
        if (confirm('Are you sure you want to delete this animal?')) {
            this.data = this.data.filter(animal => animal.id != id);
            this.render();
        }
    }

    editAnimal(id) {
        const animal = this.data.find(a => a.id == id);
        if (!animal) return;

        const newName = prompt('Enter new name:', animal.name);
        const newSize = prompt('Enter new size:', animal.size);
        const newLocation = prompt('Enter new location:', animal.location);

        if (newName && newSize && newLocation) {
            animal.name = newName;
            animal.size = parseFloat(newSize);
            animal.location = newLocation;
            this.render();
        }
    }

    getDefaultImage() {
        return 'https://via.placeholder.com/100';
    }
}

// Create Big Cats Table Class
class BigCatsTable extends AnimalTable {
    constructor(containerId, data) {
        super(containerId, data, {
            title: 'Big Cats',
            sortableFields: ['name', 'size', 'location']
        });
    }

    getDefaultImage() {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/100px-Lion_waiting_in_Namibia.jpg';
    }
}

// Create Dogs Table Class
class DogsTable extends AnimalTable {
    constructor(containerId, data) {
        super(containerId, data, {
            title: 'Dogs',
            sortableFields: ['name', 'location']
        });
    }

    getNameStyle() {
        return 'class="bold-text"';
    }

    getDefaultImage() {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_-_DSC_0346_%2810096362833%29.jpg/100px-German_Shepherd_-_DSC_0346_%2810096362833%29.jpg';
    }
}

//Create Fish Table Class
class FishTable extends AnimalTable {
    constructor(containerId, data) {
        super(containerId, data, {
            title: 'Big Fish',
            sortableFields: ['size']
        });
    }

    getNameStyle() {
        return 'class="blue-bold-italic"';
    }

    getDefaultImage() {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Whale_shark_Georgia_aquarium.jpg/100px-Whale_shark_Georgia_aquarium.jpg';
    }
}

// Dummy Data
const bigCatsData = [
    { id: 1, name: 'Tiger', size: 10, location: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/100px-Walking_tiger_female.jpg' },
    { id: 2, name: 'Lion', size: 8, location: 'Africa', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/100px-Lion_waiting_in_Namibia.jpg' },
    { id: 3, name: 'Leopard', size: 5, location: 'Africa and Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Leopard_male_cropped.jpg/100px-Leopard_male_cropped.jpg' }
];

const dogsData = [
    { id: 1, name: 'Rottweiler', size: 2, location: 'Germany', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Rottweiler_standing_facing_left.jpg/100px-Rottweiler_standing_facing_left.jpg' },
    { id: 2, name: 'German Shepherd', size: 2, location: 'Germany', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_-_DSC_0346_%2810096362833%29.jpg/100px-German_Shepherd_-_DSC_0346_%2810096362833%29.jpg' }
];

const fishData = [
    { id: 1, name: 'Humpback Whale', size: 15, location: 'Atlantic Ocean', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Humpback_Whale_underwater_shot.jpg/100px-Humpback_Whale_underwater_shot.jpg' },
    { id: 2, name: 'Killer Whale', size: 12, location: 'Atlantic Ocean', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/100px-Killerwhales_jumping.jpg' }
];

// Tables Initiailization
new BigCatsTable('bigCatsTable', bigCatsData);
new DogsTable('dogsTable', dogsData);
new FishTable('fishTable', fishData);