(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Nuro = factory());
}(this, (function () { 'use strict';

    /**
     * Creates a new array made up of pairs. Each pair is the element from each
     * array at that index.
     *
     * For example, index 1 is xs[1] and ys[1], index 2 is xs[2] and ys[2], etc.
     *
     * If they have different lengths, the new array will
     * be the length of the shortest one.
     */
    function zip(xs, ys) {
        const zipped = [];
        for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
            let pair = {
                left: xs[i],
                right: ys[i]
            };
            zipped.push(pair);
        }
        return zipped;
    }
    function getMethodNames(Class) {
        return Object.getOwnPropertyNames(Class.prototype).filter(x => x !== 'constructor');
    }
    function isObject(val) {
        return Object.prototype.toString.call(val) === '[object Object]';
    }
    function isFunction(val) {
        return Object.prototype.toString.call(val) === '[object Function]';
    }
    function isArray(val) {
        return Array.isArray(val);
    }

    function createElementFactory(includes) {
        return function (type, props = {}, children = []) {
            if (!isArray(children)) {
                children = [children];
            }
            let nodeType;
            let tag;
            let componentClass;
            if (typeof type == 'function') {
                // First argument is a component class
                nodeType = 'component';
                tag = '';
                componentClass = type;
            }
            else if (includes.has(type)) {
                // First argument is the name of a component in the includes map
                nodeType = 'component';
                tag = '';
                componentClass = includes.get(type);
            }
            else {
                // First argument is a regular element tag
                nodeType = 'element';
                tag = type;
            }
            let vNode = {
                nodeType: nodeType,
                tag: tag,
                text: '',
                attrs: props,
                children: [],
                componentClass: componentClass
            };
            vNode.children = children.map(child => {
                if (isVNode(child)) {
                    return child;
                }
                else {
                    return {
                        nodeType: 'text',
                        tag: '',
                        text: child,
                        attrs: {},
                        children: []
                    };
                }
            });
            return vNode;
        };
    }
    function isVNode(child) {
        return child != null && child.nodeType !== undefined;
    }

    class NuroError extends Error {
        constructor(message) {
            super(message);
        }
    }

    class DiffEngine {
        constructor(domPatcher) {
            this.domPatcher = domPatcher;
        }
        reconcile(element, vOldNode, vNewNode) {
            let patch = this.createPatchFunction(vOldNode, vNewNode);
            let newElement = patch(element);
            if (newElement) {
                return newElement;
            }
            else {
                throw new NuroError('Patch function did not return an element');
            }
        }
        createPatchFunction(vOldNode, vNewNode) {
            return this.diffNodes(vOldNode, vNewNode);
        }
        diffNodes(vOldNode, vNewNode) {
            if (!vNewNode) {
                return node => this.domPatcher.removeNode(node);
            }
            // If one node is text and the texts don't match or one is not text
            if ((vOldNode.nodeType === 'text' || vNewNode.nodeType === 'text') &&
                (vNewNode.text !== vOldNode.text ||
                    vOldNode.nodeType !== 'text' ||
                    vNewNode.nodeType !== 'text')) {
                return node => this.domPatcher.replaceNode(node, vNewNode);
            }
            if (vNewNode.nodeType === 'component') {
                if (vOldNode.componentClass !== vNewNode.componentClass) {
                    // Component is replacing non-component or replacing different component
                    return node => this.domPatcher.mountComponentOnNode(node, vOldNode, vNewNode);
                }
                else {
                    // Same component already exists here so update props
                    return node => this.domPatcher.setComponentPropsOnNode(node, vNewNode.attrs);
                }
            }
            if (vOldNode.tag !== vNewNode.tag) {
                // New node is not component
                return node => {
                    if (vOldNode.nodeType === 'component') {
                        // Non-component is replacing component so unmount old component
                        this.domPatcher.unmountComponentOnNode(node);
                    }
                    return this.domPatcher.replaceNode(node, vNewNode);
                };
            }
            let patchAttrs = this.diffAttributes(vOldNode.attrs, vNewNode.attrs);
            const patchChildren = this.diffChildren(vOldNode.children, vNewNode.children);
            return node => {
                patchAttrs(node);
                patchChildren(node);
                return node;
            };
        }
        diffAttributes(vOldAttrs, vNewAttrs) {
            let patches = [];
            // set new attributes
            for (const [vNewAttrName, vNewAttrValue] of Object.entries(vNewAttrs)) {
                patches.push(node => {
                    this.domPatcher.setAttribute(node, vNewAttrName, vNewAttrValue);
                    return node;
                });
            }
            // remove old attributes
            for (const vOldAttrName in vOldAttrs) {
                // If an old attribute doesn't exist in the new vNode
                // OR the old attribute is now undefined or null, remove it
                if (!(vOldAttrName in vNewAttrs) || vNewAttrs[vOldAttrName] == null) {
                    patches.push(node => {
                        this.domPatcher.removeAttribute(node, vOldAttrName);
                        return node;
                    });
                }
            }
            return node => {
                for (const patch of patches) {
                    patch(node);
                }
                return node;
            };
        }
        diffChildren(vOldChildren = [], vNewChildren = []) {
            const childPatches = [];
            vOldChildren.forEach((vOldChild, i) => {
                childPatches.push(this.diffNodes(vOldChild, vNewChildren[i]));
            });
            const additionalPatches = [];
            for (const additionalVChild of vNewChildren.slice(vOldChildren.length)) {
                additionalPatches.push(parent => this.domPatcher.appendChildNode(parent, additionalVChild));
            }
            return parent => {
                if (childPatches.length !== parent.childNodes.length) {
                    throw new NuroError('Actual child nodes in DOM does not match number of child patches');
                }
                let patchChildNodesPairs = zip(childPatches, parent.childNodes);
                for (const pair of patchChildNodesPairs) {
                    const patch = pair.left;
                    const child = pair.right;
                    patch(child);
                }
                for (const patch of additionalPatches) {
                    patch(parent);
                }
                return parent;
            };
        }
    }

    /**
     * Builds a VNode instance based on a given Element
     * @param {Node} rootNode
     */
    function mapVNode(rootNode, includeComments = true) {
        return createVNode(rootNode, includeComments);
    }
    function createVNode(node, includeComments) {
        if (node.nodeType === 1) {
            // Node is an element
            let vNode = {
                nodeType: 'element',
                tag: node.tagName.toLowerCase(),
                text: '',
                attrs: {},
                children: []
            };
            Array.prototype.forEach.call(node.attributes, attr => {
                vNode.attrs[attr.name] = attr.value;
            });
            vNode.children = createChildren(node.childNodes, includeComments);
            return vNode;
        }
        else {
            // Node is text or comment
            return {
                nodeType: node.nodeType === 8 ? 'comment' : 'text',
                text: node.textContent || '',
                tag: '',
                attrs: {},
                children: []
            };
        }
    }
    function createChildren(children, includeComments) {
        let vChildren = [];
        Array.prototype.forEach.call(children, child => {
            if (includeComments || child.nodeType !== 8) {
                let vNode = createVNode(child, includeComments);
                vChildren.push(vNode);
            }
        });
        return vChildren;
    }

    /**
     * Gets the node context object inside DOM node and creates it
     * if it doesn't exist
     */
    function getOrCreateNodeContext(node) {
        if (!node._nuro) {
            node._nuro = {
                eventHandlers: {}
            };
        }
        return node._nuro;
    }
    function setEventHandler(node, eventType, handler) {
        let nodeContext = getOrCreateNodeContext(node);
        let existingHandler = nodeContext.eventHandlers[eventType];
        if (existingHandler) {
            if (existingHandler !== handler) {
                node.removeEventListener(eventType, existingHandler);
                node.addEventListener(eventType, handler);
                nodeContext.eventHandlers[eventType] = handler;
            }
        }
        else {
            node.addEventListener(eventType, handler);
            nodeContext.eventHandlers[eventType] = handler;
        }
    }
    function removeEventHandler(node, eventType) {
        let nodeContext = getOrCreateNodeContext(node);
        node.removeEventListener(eventType, nodeContext.eventHandlers[eventType]);
        delete nodeContext.eventHandlers[eventType];
    }
    function setComponentProxy(node, componentProxy) {
        let nodeContext = getOrCreateNodeContext(node);
        nodeContext.component = componentProxy;
    }
    function getComponentProxy(node) {
        let nodeContext = getOrCreateNodeContext(node);
        if (nodeContext.component) {
            return nodeContext.component;
        }
        else {
            throw new NuroError('Element does not have component inside context object');
        }
    }
    function hasComponentProxy(node) {
        return node._nuro != null && node._nuro.component != null;
    }
    function deleteNodeContext(node) {
        delete node._nuro;
    }

    class DomPatcher {
        constructor(mountComponent, unmountComponent, setProps) {
            this.mountComponent = mountComponent;
            this.unmountComponent = unmountComponent;
            this.setProps = setProps;
        }
        removeNode(node) {
            node.remove();
        }
        replaceNode(node, vNewNode) {
            let newNode = this.createNode(vNewNode);
            this.unmountComponent(node);
            node.replaceWith(newNode);
            return newNode;
        }
        appendChildNode(node, vChildNode) {
            node.appendChild(this.createNode(vChildNode));
            return node;
        }
        mountComponentOnNode(node, vOldNode, vNewNode) {
            if (vNewNode.componentClass) {
                this.unmountComponent(node);
                return this.mountComponent(vNewNode.componentClass, node, vNewNode.attrs, vNewNode.children, vOldNode);
            }
            else {
                throw new NuroError('Component class is required for component node type');
            }
        }
        setComponentPropsOnNode(node, props) {
            return this.setProps(node, props);
        }
        unmountComponentOnNode(node) {
            this.unmountComponent(node);
        }
        createNode(vNode, isSVG = false) {
            let node;
            isSVG = isSVG || vNode.tag === 'svg';
            if (vNode.nodeType === 'component') {
                if (vNode.componentClass) {
                    let tempDiv = document.createElement('div');
                    let vOldNode = mapVNode(tempDiv);
                    node = this.mountComponent(vNode.componentClass, tempDiv, vNode.attrs, vNode.children, vOldNode);
                }
                else {
                    throw new NuroError('Component class is required for component node type');
                }
            }
            else if (vNode.nodeType === 'text') {
                node = document.createTextNode(vNode.text);
            }
            else if (isSVG) {
                node = document.createElementNS('http://www.w3.org/2000/svg', vNode.tag);
            }
            else {
                node = document.createElement(vNode.tag);
            }
            if (vNode.nodeType !== 'component') {
                for (let [name, value] of Object.entries(vNode.attrs)) {
                    this.setAttribute(node, name, value);
                }
                vNode.children.forEach(vNodeChild => {
                    let createdNode = this.createNode(vNodeChild, isSVG);
                    node.appendChild(createdNode);
                });
            }
            return node;
        }
        // Sets the attribute on the node and sometimes sets the property on the node with
        // the same name.
        setAttribute(node, attrName, attrValue) {
            if (attrName === 'checked') {
                let inputNode = node;
                inputNode.checked = !!attrValue;
            }
            if (attrValue != null) {
                if (attrName.startsWith('@')) {
                    if (isFunction(attrValue)) {
                        setEventHandler(node, attrName.substring(1), attrValue);
                    }
                    else {
                        throw new NuroError('Event handler must be a function');
                    }
                }
                else {
                    node.setAttribute(attrName, attrValue);
                }
            }
        }
        removeAttribute(node, attrName) {
            if (attrName.startsWith('@')) {
                removeEventHandler(node, attrName.substring(1));
            }
            else {
                node.removeAttribute(attrName);
            }
        }
        createElementInBody(tagName) {
            let element = document.createElement(tagName);
            document.body.appendChild(element);
            return element;
        }
    }

    function createComponentProxy(component) {
        return new Proxy(component, proxyHandler);
    }
    const proxyHandler = {
        get: handleGet,
        set: handleSet,
        deleteProperty: handleDelete
    };
    function handleGet(obj, prop) {
        let val = obj[prop];
        if (isObject(val) || isArray(val)) {
            // If obj is the props object, don't wrap in Proxy
            if (prop === 'props' && !obj.$component) {
                return val;
            }
            // Pass on the ref to component to nested state
            val.$component = getComponent(obj);
            if (isArray(val)) {
                // Pass on the node and vnode objects to each object in array
                val.forEach((element) => {
                    if (isObject(element)) {
                        element.$component = getComponent(obj);
                    }
                });
            }
            return new Proxy(val, proxyHandler);
        }
        else {
            return obj[prop];
        }
    }
    function handleSet(obj, prop, value) {
        obj[prop] = value;
        let component = getComponent(obj);
        if (prop === 'props') {
            component.$vnode.attrs = value;
        }
        component.$update();
        return true;
    }
    function handleDelete(obj, prop) {
        delete obj[prop];
        let component = getComponent(obj);
        component.$update();
        return true;
    }
    function getComponent(obj) {
        return obj.$component != null ? obj.$component : obj;
    }

    function callHook(component, hookName) {
        if (component[hookName]) {
            component[hookName]();
        }
    }

    /**
     * Convert a HTML string representing one DOM node and turns
     * it into a real DOM node.
     */
    function htmlToDom(html) {
        let document = new DOMParser().parseFromString(html, 'text/html');
        let wrapperNode = document.body;
        return wrapperNode.children[0];
    }

    /**
     * Map of templates and the compiled render method code
     */
    const cache = new Map();
    /**
     * Takes a template string and returns code for a render method. The code will later be turned
     * into a real function using the Function constructor.
     */
    function compileTemplate(template) {
        let cachedCode = cache.get(template);
        if (cachedCode) {
            return cachedCode;
        }
        let node = htmlToDom(template);
        let vNode = mapVNode(node, false);
        let code = 'with(this){return ' + compileNode(vNode) + '}';
        cache.set(template, code);
        return code;
    }
    function compileNode(vNode) {
        if (vNode.nodeType === 'text') {
            // Replace newline characters with \n to prevent
            // errors when the string is converted into a Function
            let text = vNode.text.replace(/\n/g, '\\n');
            text = compileText(text);
            return text;
        }
        else {
            // Node is element
            if (vNode.attrs.$if !== undefined) {
                return compileIfDirective(vNode);
            }
            else if (vNode.attrs.$for !== undefined) {
                return compileForDirective(vNode);
            }
            else if (vNode.tag === 'slot') {
                return compileSlot();
            }
            else {
                return compileElement(vNode);
            }
        }
    }
    function compileElement(vNode) {
        // Beginning of createElement call
        let code = 'h(';
        // First argument: Tag
        code += "'" + vNode.tag + "'";
        // Second argument: Attributes
        // Compile each attribute value
        let compiledAttrs = new Map();
        for (let [key, value] of Object.entries(vNode.attrs)) {
            if (key.startsWith('$')) {
                // Skip directive attributes
                continue;
            }
            if (key.startsWith(':')) {
                // Shorthand attribute binding syntax
                key = key.substr(1);
            }
            else if (key.startsWith('@')) ;
            else {
                // Regular attribute
                value = compileText(value);
            }
            compiledAttrs.set(key, value);
        }
        // Handle $class directive
        if (vNode.attrs.$class) {
            // Returns a string with only the classes that have a truthy value
            // Dynamic classes are concatenated with the static class attribute
            let staticClassValue = compiledAttrs.has('class') ? compiledAttrs.get('class') : "''";
            let classExpressionCode = `Object.entries(${vNode.attrs.$class}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,${staticClassValue}).trim()`;
            compiledAttrs.set('class', classExpressionCode);
        }
        // Turn map of compiled attributes into object literal code
        let attrsObjectCode = '{' +
            Array.from(compiledAttrs)
                .map(([key, value]) => `'${key}':${value}`)
                .join(',') +
            '}';
        // Handle $attrs directive
        if (vNode.attrs.$attrs) {
            // Merges properties from the $attrs object to the rest of the properties
            // If there is a class property, concatenate them instead of replacing
            let attrs = attrsObjectCode;
            let newAttrs = vNode.attrs.$attrs;
            attrsObjectCode = `{...${attrs},...${newAttrs},...{class:(${attrs}.class?(${attrs}.class+' '+(${newAttrs}.class||'')).trim():${newAttrs}.class)}}`;
        }
        code += ',' + attrsObjectCode;
        // Third argument: Children
        if (vNode.children.length > 0) {
            let children = [];
            vNode.children.forEach(vChild => {
                if (vChild.nodeType === 'text' && vChild.text.trim() === '') {
                    // Skip blank text nodes
                    return;
                }
                let childCode = compileNode(vChild);
                children.push(childCode);
            });
            let joinedChildren = children.join(',');
            code += ',[' + joinedChildren + ']';
        }
        // End of createElement call
        code += ')';
        return code;
    }
    function compileIfDirective(vNode) {
        let ifValue = vNode.attrs.$if;
        delete vNode.attrs.$if;
        // Build ternary expression that defaults to empty string
        return `(${ifValue})?${compileElement(vNode)}:''`;
    }
    function compileForDirective(vNode) {
        let forValue = vNode.attrs.$for;
        delete vNode.attrs.$for;
        let forValueSplit = forValue.trim().split(' in ');
        let elementName = forValueSplit[0]; // Can include index as well
        let arrayName = forValueSplit[1];
        // Build Array.map() call
        // Use spread operator since this code will be inside of square brackets
        return `...${arrayName}.map((${elementName})=>${compileNode(vNode)})`;
    }
    function compileSlot() {
        return '...props.children';
    }
    function compileText(text) {
        if (text.length < 5) {
            return "'" + text + "'";
        }
        let inExpression = false;
        let expression = '';
        let output = '';
        if (text.charAt(0) !== '{' || text.charAt(1) !== '{') {
            output += "'";
        }
        let char, nextChar;
        for (let i = 0; i < text.length; i++) {
            char = text.charAt(i);
            nextChar = text.length > i ? text.charAt(i + 1) : false;
            if (char === '{' && nextChar && nextChar === '{') {
                if (i !== 0) {
                    output += "'+";
                }
                output += '(';
                i++; // Skip second bracket
                inExpression = true;
            }
            else if (char === '}') {
                i++; // Skip second bracket
                output += expression + ')';
                inExpression = false;
                expression = '';
                if (i !== text.length - 1) {
                    output += "+'";
                }
            }
            else if (inExpression) {
                expression += char;
            }
            else {
                output += char;
            }
        }
        if (char !== "'" && char !== '}') {
            output += "'";
        }
        return output;
    }

    /**
     * Converts a camel case string to kebab case:
     * myStringValue -> my-string-value
     */
    function camelCaseToKebabCase(camelCase) {
        // Map each character
        return camelCase
            .split('')
            .map((char, i) => {
            // If char is an upper case letter
            if (isLetter(char) && char === char.toUpperCase()) {
                // Make it lower case and also add a hyphen if it is not the first char
                if (i === 0) {
                    return char.toLowerCase();
                }
                else {
                    return '-' + char.toLowerCase();
                }
            }
            else {
                // Else return the lower case char
                return char;
            }
        })
            .join('');
    }
    function isLetter(character) {
        return character.length === 1 && character.toLowerCase() != character.toUpperCase();
    }

    const globalIncludes = new Map();
    function include(componentName, ComponentClass) {
        globalIncludes.set(camelCaseToKebabCase(componentName), ComponentClass);
    }

    const mixins = [];
    function addMixin(mixin) {
        mixins.push(mixin);
    }
    /*
      Add all properties from the mixin object to the component.
      // TODO: if prop is a lifecycle hook, use both instead of replacing the component's
    */
    function applyMixins(component) {
        mixins.forEach(mixin => {
            Object.keys(mixin).forEach(prop => {
                component[prop] = mixin[prop];
            });
        });
    }

    let domPatcher = new DomPatcher(mountComponent, unmountComponent, setProps);
    function mountRootComponent(ComponentClass, element, props = {}) {
        if (!element) {
            element = domPatcher.createElementInBody('div');
        }
        let vOldNode = mapVNode(element);
        let newNode = mountComponent(ComponentClass, element, props, [], vOldNode);
        return getComponentProxy(newNode);
    }
    function mountComponent(ComponentClass, element, props, children, vOldNode) {
        let component = new ComponentClass(props);
        callHook(component, 'beforeInit');
        applyMixins(component);
        let localIncludes = component.$includes || {};
        component.$includes = getComponentIncludes(localIncludes, globalIncludes);
        if (!component.render) {
            if (component.$template) {
                let renderMethodCode = compileTemplate(component.$template);
                component.render = new Function('h', renderMethodCode);
            }
            else {
                throw new NuroError('Either a render method or a $template string is required in a component class');
            }
        }
        component.$element = element;
        component.$vnode = vOldNode;
        component.props = props;
        component.props.children = children;
        let componentProxy = createComponentProxy(component);
        component.$update = function () {
            updateComponent(component);
        };
        bindAllMethods(component, componentProxy, ComponentClass);
        callHook(componentProxy, 'beforeMount');
        updateComponent(component);
        callHook(componentProxy, 'afterMount');
        setComponentProxy(component.$element, componentProxy);
        return component.$element;
    }
    /**
     * Make component names lower case and remove dashes
     */
    function getComponentIncludes(classIncludes, globalIncludes) {
        let includes = new Map([...globalIncludes]);
        for (let originalName in classIncludes) {
            let componentClass = classIncludes[originalName];
            let kebabName = camelCaseToKebabCase(originalName);
            includes.set(originalName, componentClass);
            includes.set(kebabName, componentClass);
        }
        return includes;
    }
    function bindAllMethods(component, componentProxy, ComponentClass) {
        getMethodNames(ComponentClass).forEach(method => {
            component[method] = component[method].bind(componentProxy);
        });
    }
    function unmountComponent(element) {
        if (element != null && hasComponentProxy(element)) {
            let component = getComponentProxy(element);
            callHookRecursively(component.$element, 'beforeUnmount');
            deleteNodeContext(element);
            return true;
        }
        else {
            return false;
        }
    }
    function callHookRecursively(element, hook) {
        Array.from(element.children).forEach(child => {
            callHookRecursively(child, hook);
        });
        if (hasComponentProxy(element)) {
            let component = getComponentProxy(element);
            callHook(component, hook);
        }
    }
    function updateComponent(component) {
        callHook(component, 'beforeRender');
        let createElement = createElementFactory(component.$includes);
        let newVNode = component.render(createElement);
        if (!newVNode.nodeType) {
            throw new NuroError('Component render method did not return VNode');
        }
        let diffEngine = new DiffEngine(domPatcher);
        let newNode = diffEngine.reconcile(component.$element, component.$vnode, newVNode);
        callHook(component, 'afterRender');
        component.$vnode = newVNode;
        component.$element = newNode;
        return component;
    }
    function setProps(node, props) {
        let componentProxy = getComponentProxy(node);
        componentProxy.props = props;
        return node;
    }

    const installedPlugins = [];
    function installPlugin(plugin, options = {}) {
        if (!installedPlugins.includes(plugin)) {
            plugin.install(this, options);
            installedPlugins.push(plugin);
        }
    }

    const globalAPI = {
        mount: mountRootComponent,
        unmount: unmountComponent,
        compileTemplate: compileTemplate,
        include: include,
        mixin: addMixin,
        install: installPlugin
    };

    return globalAPI;

})));
