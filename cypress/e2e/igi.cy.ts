import selectors from '../selectors';
import { Group } from '../../src/store.types';

export {};

describe('IGI', () => {
  beforeEach(() => {
    cy.intercept('**/*.gpx').as('gpx');
    cy.visit('http://localhost:5173/');
    cy.wait(new Array(8).fill('@gpx'));
  });

  it('should load app initially', () => {
    cy.fixture('itinerary.json').then((wanted: any) => {
      cy.get(selectors.groupItem).should('have.length', 4);
      checkGroupItem(0, wanted.groups[0]);
      checkGroupItem(1, wanted.groups[1]);
      checkGroupItem(2, wanted.groups[2]);
      checkGroupItem(3, wanted.groups[3]);
    });
    cy.get(selectors.mapMarker).should('have.length', 5);
    cy.get(selectors.activeMapMarker).should('have.length', 1);
    cy.get(selectors.mediaContainer)
      .find('img')
      .should('have.attr', 'src', 'itinerary/forest.jpg')
      .should('have.attr', 'alt', 'The forest where I hiked.')
      .should('have.attr', 'title', 'The forest where I hiked.');
  });

  it('should load media when clicking on map markers', () => {
    cy.get(selectors.mapMarker).should('have.length', 5).eq(3).click();
    cy.get(selectors.mediaContainer)
      .find('img')
      .should('have.attr', 'src', 'itinerary/way.jpg')
      .should('have.attr', 'alt', 'A way in the forest.')
      .should('have.attr', 'title', 'A way in the forest.');
    cy.get(selectors.mapMarker).should('have.length', 5).eq(2).click();
    cy.get(selectors.mediaContainer).find('img').should('not.exist');
    cy.get(selectors.mediaContainer)
      .find('video')
      .should('have.attr', 'src', 'itinerary/mouse.mp4')
      .should('have.attr', 'title', 'A mouse in the underwoods');
  });

  it('should cycle media by arrow keys', () => {
    const images = [
      { src: 'itinerary/path.jpg', alt: 'Image of a path in the woods.' },
      {
        src: 'itinerary/mouse.mp4',
        alt: 'A mouse in the underwoods',
        type: 'video',
      },
      { src: 'itinerary/herbs.jpg', alt: 'Herbs along the way' },
      { src: 'itinerary/way.jpg', alt: 'A way in the forest.' },
      { src: 'itinerary/fields.jpg', alt: 'Fields in the landscape.' },
      { src: 'itinerary/forest.jpg', alt: 'The forest where I hiked.' },
    ];

    let key = 'ArrowRight';
    const checkImage = (image: any) => {
      cy.get('html').trigger('keyup', {
        eventConstructor: 'KeyboardEvent',
        key,
      });
      cy.get(selectors.mediaContainer)
        .find(image.type || 'img')
        .should('have.attr', 'src', image.src)
        .should('have.attr', 'title', image.alt);
      if (image.type !== 'video') {
        cy.get(selectors.mediaContainer)
          .find('img')
          .should('have.attr', 'alt', image.alt);
      }
    };
    images.forEach((image) => checkImage(image));
    cy.get('html').trigger('keyup', {
      eventConstructor: 'KeyboardEvent',
      key,
    });
    key = 'ArrowLeft';
    images.reverse().forEach((image) => checkImage(image));
  });

  it('should cycle media by click on image', () => {
    const images = [
      { src: 'itinerary/path.jpg', alt: 'Image of a path in the woods.' },
      {
        src: 'itinerary/mouse.mp4',
        alt: 'A mouse in the underwoods',
        type: 'video',
      },
      { src: 'itinerary/herbs.jpg', alt: 'Herbs along the way' },
      { src: 'itinerary/way.jpg', alt: 'A way in the forest.' },
      { src: 'itinerary/fields.jpg', alt: 'Fields in the landscape.' },
      { src: 'itinerary/forest.jpg', alt: 'The forest where I hiked.' },
    ];

    const checkImage = (image: any) => {
      cy.get(selectors.mediaContainer).click();
      cy.get(selectors.mediaContainer)
        .find(image.type || 'img')
        .should('have.attr', 'src', image.src)
        .should('have.attr', 'title', image.alt);
      if (image.type !== 'video') {
        cy.get(selectors.mediaContainer)
          .find('img')
          .should('have.attr', 'alt', image.alt);
      }
    };
    images.forEach((image) => checkImage(image));
  });

  it('should unselect all itinerary entries and show favicon image and no markers', () => {
    cy.get(selectors.groupItem).should('have.length', 4);
    cy.get(selectors.groupItem).eq(1).click();
    cy.get(selectors.groupItem).eq(2).click();
    cy.get(selectors.groupItem).eq(3).click();
    cy.get(selectors.mapMarker).should('not.exist');
    cy.get(selectors.mediaContainer)
      .find('img')
      .should('have.attr', 'src')
      .should('equal', 'itinerary/favicon.png');
  });

  it('should change media and markers if groups are selected or unselected', () => {
    cy.get(selectors.groupItem).eq(1).click();
    cy.get(selectors.groupItem).eq(3).click();
    cy.get(selectors.mapMarker).should('have.length', 2);
    cy.get(selectors.activeMapMarker).should('be.visible');
    cy.get(selectors.mediaContainer).get('video').should('exist');
    cy.get(selectors.mediaContainer).click();
    cy.get(selectors.mediaContainer).get('img').should('exist');
    cy.get(selectors.mediaContainer).click();
    cy.get(selectors.mediaContainer).click();
    cy.get(selectors.mediaContainer).get('video').should('exist');
  });

  it('should make different elements of page visible/invisible', () => {
    cy.get(selectors.groupItem)
      .eq(0)
      .trigger('keyup', { eventConstructor: 'KeyboardEvent', key: 'i' });
    cy.get(selectors.mediaContainer).should('not.be.visible');
    cy.get(selectors.groupItem)
      .eq(0)
      .trigger('keyup', { eventConstructor: 'KeyboardEvent', key: 'l' });
    cy.get(selectors.groupItem).should('not.be.visible');
    cy.get(selectors.mapMarker).should('have.length', 5);
    cy.get(selectors.activeMapMarker).should('exist');
    cy.get(selectors.activeMapMarker)
      .eq(0)
      .trigger('keyup', { eventConstructor: 'KeyboardEvent', key: 'm' });
    cy.get(selectors.mediaContainer)
      .should('be.visible')
      .find('img')
      .should('exist')
      .should('have.attr', 'src')
      .should('equal', 'itinerary/forest.jpg');
    cy.get(selectors.mediaContainer)
      .find('img')
      .trigger('keyup', { eventConstructor: 'KeyboardEvent', key: 'm' });
    cy.get(selectors.mapMarker).should('have.length', 5);
    cy.get(selectors.activeMapMarker).should('exist');
    cy.get(selectors.mediaContainer)
      .find('img')
      .trigger('keyup', { eventConstructor: 'KeyboardEvent', key: 'l' });
    cy.get(selectors.groupItem).should('be.visible');
  });

  it('should show help', () => {
    cy.get(selectors.appInfo).should('not.be.visible');
    cy.get(selectors.infoButton).click();
    cy.get(selectors.appInfo).should('be.visible');
    cy.get(selectors.infoButton).click();
    cy.get(selectors.appInfo).should('not.be.visible');
  });
});

function checkGroupItem(index: number, group: Group) {
  cy.get(selectors.groupItem)
    .eq(index)
    .within(() => {
      cy.get(selectors.groupItemTitle).should('contain', group.name);
      cy.get(selectors.trackItem).should('have.length', group.tracks.length);
      group.tracks.forEach((track, index) => {
        cy.get(selectors.trackItem)
          .eq(index)
          .within(() => {
            cy.get(selectors.trackItemInfo).should('contain', track.info);
            cy.get(selectors.trackItemIndicator).should(
              'contain',
              // @ts-ignore
              track.indicator
            );
            cy.get(selectors.trackItemIndicator).should(
              'have.css',
              'background-color',
              track.color
            );
            cy.get(selectors.trackItemDistance).should(
              'contain',
              // @ts-ignore
              track.distance
            );
            cy.get(selectors.trackItemName).should('contain', track.name);
          });
      });
    })
    .should(
      'have.css',
      'background-color',
      group.selected ? 'rgb(17, 17, 17)' : 'rgba(0, 0, 0, 0)'
    );
}
