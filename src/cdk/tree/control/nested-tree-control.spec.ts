import {fakeAsync, flush} from '@angular/core/testing';
import {of as observableOf} from 'rxjs';
import {NestedTreeControl} from './nested-tree-control';


describe('CdkNestedTreeControl', () => {
  let treeControl: NestedTreeControl<TestData>;
  let getChildren = (node: TestData) => observableOf(node.children);

  beforeEach(() => {
    treeControl = new NestedTreeControl<TestData>(getChildren);
  });

  describe('base tree control actions', () => {
    it('should be able to expand and collapse dataNodes', () => {
      const nodes = generateData(10, 4);
      const node = nodes[1];
      const sixthNode = nodes[5];
      treeControl.dataNodes = nodes;

      treeControl.expand(node);


      expect(treeControl.isExpanded(node)).toBeTruthy('Expect second node to be expanded');
      expect(treeControl.expansionModel.selected)
        .toContain(node, 'Expect second node in expansionModel');
      expect(treeControl.expansionModel.selected.length)
        .toBe(1, 'Expect only second node in expansionModel');

      treeControl.toggle(sixthNode);

      expect(treeControl.isExpanded(node)).toBeTruthy('Expect second node to stay expanded');
      expect(treeControl.expansionModel.selected)
        .toContain(sixthNode, 'Expect sixth node in expansionModel');
      expect(treeControl.expansionModel.selected)
        .toContain(node, 'Expect second node in expansionModel');
      expect(treeControl.expansionModel.selected.length)
        .toBe(2, 'Expect two dataNodes in expansionModel');

      treeControl.collapse(node);

      expect(treeControl.isExpanded(node)).toBeFalsy('Expect second node to be collapsed');
      expect(treeControl.expansionModel.selected.length)
        .toBe(1, 'Expect one node in expansionModel');
      expect(treeControl.isExpanded(sixthNode)).toBeTruthy('Expect sixth node to stay expanded');
      expect(treeControl.expansionModel.selected)
        .toContain(sixthNode, 'Expect sixth node in expansionModel');
    });

    it('should toggle descendants correctly', () => {
      const numNodes = 10;
      const numChildren = 4;
      const numGrandChildren = 2;
      const nodes = generateData(numNodes, numChildren, numGrandChildren);
      treeControl.dataNodes = nodes;

      treeControl.expandDescendants(nodes[1]);

      const expandedNodesNum = 1 + numChildren + numChildren * numGrandChildren;
      expect(treeControl.expansionModel.selected.length)
        .toBe(expandedNodesNum, `Expect expanded ${expandedNodesNum} nodes`);

      expect(treeControl.isExpanded(nodes[1])).toBeTruthy('Expect second node to be expanded');
      for (let i = 0; i < numChildren; i++) {

        expect(treeControl.isExpanded(nodes[1].children[i]))
          .toBeTruthy(`Expect second node's children to be expanded`);
        for (let j = 0; j < numGrandChildren; j++) {
          expect(treeControl.isExpanded(nodes[1].children[i].children[j]))
            .toBeTruthy(`Expect second node grand children to be expanded`);
        }
      }
    });

    it('should be able to expand/collapse all the dataNodes', () => {
      const numNodes = 10;
      const numChildren = 4;
      const numGrandChildren = 2;
      const nodes = generateData(numNodes, numChildren, numGrandChildren);
      treeControl.dataNodes = nodes;

      treeControl.expandDescendants(nodes[1]);

      treeControl.collapseAll();

      expect(treeControl.expansionModel.selected.length).toBe(0, `Expect no expanded nodes`);

      treeControl.expandAll();

      const totalNumber = numNodes + numNodes * numChildren
        + numNodes * numChildren * numGrandChildren;
      expect(treeControl.expansionModel.selected.length)
        .toBe(totalNumber, `Expect ${totalNumber} expanded nodes`);
    });

    // Note that this needs to be `fakeAsync` in order to
    // catch the error inside an observable correctly.
    it('should handle null children', fakeAsync(() => {
      const nodes = generateData(3, 2);

      nodes[1].children = null!;
      treeControl.dataNodes = nodes;

      expect(() => {
        treeControl.expandAll();
        flush();
      }).not.toThrow();
    }));

    describe('with children array', () => {
      let getStaticChildren = (node: TestData) => node.children;

      beforeEach(() => {
        treeControl = new NestedTreeControl<TestData>(getStaticChildren);
      });

      it('should be able to expand and collapse dataNodes', () => {
        const nodes = generateData(10, 4);
        const node = nodes[1];
        const sixthNode = nodes[5];
        treeControl.dataNodes = nodes;

        treeControl.expand(node);


        expect(treeControl.isExpanded(node)).toBeTruthy('Expect second node to be expanded');
        expect(treeControl.expansionModel.selected)
          .toContain(node, 'Expect second node in expansionModel');
        expect(treeControl.expansionModel.selected.length)
          .toBe(1, 'Expect only second node in expansionModel');

        treeControl.toggle(sixthNode);

        expect(treeControl.isExpanded(node)).toBeTruthy('Expect second node to stay expanded');
        expect(treeControl.expansionModel.selected)
          .toContain(sixthNode, 'Expect sixth node in expansionModel');
        expect(treeControl.expansionModel.selected)
          .toContain(node, 'Expect second node in expansionModel');
        expect(treeControl.expansionModel.selected.length)
          .toBe(2, 'Expect two dataNodes in expansionModel');

        treeControl.collapse(node);

        expect(treeControl.isExpanded(node)).toBeFalsy('Expect second node to be collapsed');
        expect(treeControl.expansionModel.selected.length)
          .toBe(1, 'Expect one node in expansionModel');
        expect(treeControl.isExpanded(sixthNode)).toBeTruthy('Expect sixth node to stay expanded');
        expect(treeControl.expansionModel.selected)
          .toContain(sixthNode, 'Expect sixth node in expansionModel');
      });

      it('should toggle descendants correctly', () => {
        const numNodes = 10;
        const numChildren = 4;
        const numGrandChildren = 2;
        const nodes = generateData(numNodes, numChildren, numGrandChildren);
        treeControl.dataNodes = nodes;

        treeControl.expandDescendants(nodes[1]);

        const expandedNodesNum = 1 + numChildren + numChildren * numGrandChildren;
        expect(treeControl.expansionModel.selected.length)
          .toBe(expandedNodesNum, `Expect expanded ${expandedNodesNum} nodes`);

        expect(treeControl.isExpanded(nodes[1])).toBeTruthy('Expect second node to be expanded');
        for (let i = 0; i < numChildren; i++) {

          expect(treeControl.isExpanded(nodes[1].children[i]))
            .toBeTruthy(`Expect second node's children to be expanded`);
          for (let j = 0; j < numGrandChildren; j++) {
            expect(treeControl.isExpanded(nodes[1].children[i].children[j]))
              .toBeTruthy(`Expect second node grand children to be expanded`);
          }
        }
      });

      it('should be able to expand/collapse all the dataNodes', () => {
        const numNodes = 10;
        const numChildren = 4;
        const numGrandChildren = 2;
        const nodes = generateData(numNodes, numChildren, numGrandChildren);
        treeControl.dataNodes = nodes;

        treeControl.expandDescendants(nodes[1]);

        treeControl.collapseAll();

        expect(treeControl.expansionModel.selected.length).toBe(0, `Expect no expanded nodes`);

        treeControl.expandAll();

        const totalNumber = numNodes + (numNodes * numChildren)
          + (numNodes * numChildren * numGrandChildren);
        expect(treeControl.expansionModel.selected.length)
          .toBe(totalNumber, `Expect ${totalNumber} expanded nodes`);
      });
    });
  });

  it('maintains node expansion state based on trackBy function, if provided', () => {
    const treeControl = new NestedTreeControl<TestData, string>(getChildren);

    const nodes = generateData(2, 2);
    const secondNode = nodes[1];
    treeControl.dataNodes = nodes;
    treeControl.trackBy = (node: TestData) => `${node.a} ${node.b} ${node.c}`;

    treeControl.expand(secondNode);
    expect(treeControl.isExpanded(secondNode)).toBeTruthy('Expect second node to be expanded');

    // Replace the second node with a brand new instance with same hash
    nodes[1] = new TestData(
        secondNode.a, secondNode.b, secondNode.c, secondNode.level, secondNode.children);
    expect(treeControl.isExpanded(nodes[1])).toBeTruthy('Expect second node to still be expanded');
  });

});

export class TestData {
  a: string;
  b: string;
  c: string;
  level: number;
  children: TestData[];

  constructor(a: string, b: string, c: string, level: number = 1, children: TestData[] = []) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.level = level;
    this.children = children;
  }
}

function generateData(dataLength: number, childLength: number, grandChildLength: number = 0)
    : TestData[] {
  let data: TestData[] = [];
  let nextIndex = 0;
  for (let i = 0; i < dataLength; i++) {
    let children: TestData[] = [];
    for (let j = 0; j < childLength; j++) {
      let grandChildren: TestData[] = [];
      for (let k = 0; k < grandChildLength; k++) {
        grandChildren.push(new TestData(`a_${nextIndex}`, `b_${nextIndex}`, `c_${nextIndex++}`, 3));
      }
      children.push(
        new TestData(`a_${nextIndex}`, `b_${nextIndex}`, `c_${nextIndex++}`, 2, grandChildren));
    }
    data.push(new TestData(`a_${nextIndex}`, `b_${nextIndex}`, `c_${nextIndex++}`, 1, children));
  }
  return data;
}
