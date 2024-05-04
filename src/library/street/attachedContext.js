export class AttachedContext {
    constructor(option = {}) {
        this.identifier = option.identifier;
        this.context = option.context;
    }
}

export class AttachedContextManager {
    constructor(option = {}) {
        this.attachedContextArray = option.attachedContextArray || [];
    }

    addAttachedContext(attachedContext) {
        this.attachedContextArray.push(attachedContext);
    }

    add(identifier, context) {
        const attachedContext = new AttachedContext({identifier: identifier, context: context});
        this.attachedContextArray.push(attachedContext);
        return attachedContext;
    }

    getContextByIdentifier(identifier) {
        return this.attachedContextArray.find(attachedContext => {
            return attachedContext.identifier === identifier;
        });
    }

    getVertecesByFacilityType(facilityType) {
        const verteces = [];
        this.attachedContextArray.forEach(attachedContext => {
            attachedContext.context.forEach(facility => {
                if (facility.type === facilityType) {
                    verteces.push(place.vertex);
                }
            });
        });
        return verteces;
    }
}