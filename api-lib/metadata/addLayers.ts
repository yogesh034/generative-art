import { getElements,width, height, rarityWeights } from './../../api-lib/config';
const editionDnaPrefix = 0;
const addLayers = (_id, _position, _size, _dir) => {
    console.log(`_dir :`, _dir);
    console.log(`_id1`, _id);
    if (!_id) {
      console.log('error adding layer, parameters id required');
      return null;
    }
    if (!_position) {
      _position = { x: 0, y: 0 };
    }
    if (!_size) {
      _size = { width: width, height: height };
    }
    // add two different dimension for elements:
    // - all elements with their path information
    // - only the ids mapped to their rarity
    let elements: any = [];
    let elementCount: any = 0;
    let elementIdsForRarity: any = {};
    rarityWeights.forEach((rarityWeight) => {
      // let elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);
      let elementsForRarity = getElements(`${_dir}/${_id}`, '');
      elementIdsForRarity[rarityWeight.value] = [];
      elementsForRarity.forEach((_elementForRarity) => {
        _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
        elements.push(_elementForRarity);
        elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
        elementCount++;
      });
      elements[rarityWeight.value] = elementsForRarity;
    });
  
    let elementsForLayer = {
      id: _id,
      position: _position,
      size: _size,
      elements,
      elementIdsForRarity,
    };
    return elementsForLayer;
  };
  export default addLayers