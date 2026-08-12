/* =========================================================
   VALORA ADMIN — USER DETAILS
   ========================================================= */


/* =========================================================
   PAGE HEADER
   ========================================================= */


.user-details-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;

    margin-bottom: 22px;

}


.user-details-heading {

    min-width: 0;

}



.user-details-title {

    margin: 0;

    color: var(--va-text);

    font-size: 26px;

    font-weight: 800;

}



.user-details-description {

    margin: 6px 0 0;

    color: var(--va-text-muted);

    font-size: 13px;

}





/* =========================================================
   USER PROFILE CARD
   ========================================================= */


.user-profile-card {

    display: flex;

    align-items: center;

    gap: 18px;

    padding: 22px;

    margin-bottom: 18px;

    background: var(--va-surface);

    border: 1px solid var(--va-border);

    border-radius: var(--va-radius-lg);

    box-shadow: var(--va-shadow-sm);

}



.user-profile-avatar {

    width: 72px;

    height: 72px;

    flex: 0 0 72px;

    display: grid;

    place-items: center;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            var(--va-gold-light),
            var(--va-gold-dark)
        );

    color: #080808;

    font-size: 28px;

    font-weight: 800;

}



.user-profile-info {

    min-width: 0;

}



.user-profile-name {

    margin: 0;

    color: var(--va-text);

    font-size: 20px;

    font-weight: 800;

}



.user-profile-email {

    margin: 5px 0 0;

    color: var(--va-text-muted);

    font-size: 13px;

}



.user-profile-id {

    display: inline-flex;

    margin-top: 8px;

    padding: 4px 10px;

    border-radius: 999px;

    background: rgba(255,255,255,0.04);

    border: 1px solid var(--va-border);

    color: var(--va-text-soft);

    font-size: 12px;

}





/* =========================================================
   STATUS BADGES
   ========================================================= */


.user-details-status {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    min-height: 28px;

    padding: 0 12px;

    border-radius: 999px;

    font-size: 12px;

    font-weight: 700;

}



.user-details-status.active {

    background: var(--va-success-soft);

    color: var(--va-success);

}



.user-details-status.pending {

    background: var(--va-warning-soft);

    color: var(--va-warning);

}



.user-details-status.suspended {

    background: var(--va-danger-soft);

    color: var(--va-danger);

}
/* =========================================================
   USER INFORMATION GRID
   ========================================================= */


.user-info-grid {

    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 14px;

    margin-bottom: 18px;

}



.user-info-card {

    padding: 18px;

    background: var(--va-surface);

    border: 1px solid var(--va-border);

    border-radius: var(--va-radius-md);

    box-shadow: var(--va-shadow-sm);

}



.user-info-label {

    margin: 0 0 8px;

    color: var(--va-text-muted);

    font-size: 11px;

    font-weight: 600;

}



.user-info-value {

    margin: 0;

    color: var(--va-text);

    font-size: 18px;

    font-weight: 800;

}





/* =========================================================
   BALANCE BOX
   ========================================================= */


.user-balance-box {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 16px;

    padding: 22px;

    margin-bottom: 18px;

    background:
        linear-gradient(
            135deg,
            rgba(212,175,55,0.12),
            rgba(212,175,55,0.03)
        );

    border: 1px solid rgba(212,175,55,0.20);

    border-radius: var(--va-radius-lg);

}



.user-balance-title {

    margin: 0;

    color: var(--va-text-muted);

    font-size: 12px;

}



.user-balance-value {

    margin: 6px 0 0;

    color: var(--va-gold-light);

    font-size: 30px;

    font-weight: 900;

}



.user-balance-currency {

    color: var(--va-text-soft);

    font-size: 14px;

}





/* =========================================================
   DETAILS LAYOUT
   ========================================================= */


.user-details-grid {

    display: grid;

    grid-template-columns:
        minmax(0, 1fr)
        minmax(300px, 360px);

    gap: 18px;

    align-items: start;

}



.user-details-card {

    background: var(--va-surface);

    border: 1px solid var(--va-border);

    border-radius: var(--va-radius-lg);

    overflow: hidden;

}



.user-details-card-header {

    padding: 18px 20px;

    border-bottom:

        1px solid var(--va-border);

}



.user-details-card-title {

    margin: 0;

    color: var(--va-text);

    font-size: 15px;

    font-weight: 800;

}



.user-details-card-description {

    margin: 5px 0 0;

    color: var(--va-text-muted);

    font-size: 11px;

}



.user-details-card-body {

    padding: 20px;

}
/* =========================================================
   USER DATA LIST
   ========================================================= */


.user-data-list {

    display: flex;

    flex-direction: column;

    gap: 0;

}



.user-data-row {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    padding: 14px 0;

    border-bottom:

        1px solid var(--va-border);

}



.user-data-row:last-child {

    border-bottom: 0;

}



.user-data-label {

    color: var(--va-text-muted);

    font-size: 12px;

}



.user-data-value {

    color: var(--va-text);

    font-size: 13px;

    font-weight: 700;

}





/* =========================================================
   USER ACTIONS
   ========================================================= */


.user-actions {

    display: flex;

    flex-wrap: wrap;

    gap: 10px;

}



.user-action-btn {

    min-height: 40px;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 0 16px;

    border-radius: var(--va-radius-sm);

    border: 1px solid var(--va-border);

    background: rgba(255,255,255,0.03);

    color: var(--va-text);

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    transition:

        background var(--va-transition),

        border-color var(--va-transition),

        color var(--va-transition);

}



.user-action-btn:hover {

    background: rgba(255,255,255,0.07);

    border-color: var(--va-border-strong);

}



.user-action-btn.gold {

    background: var(--va-gold);

    color: #080808;

    border-color: var(--va-gold);

}



.user-action-btn.gold:hover {

    background: var(--va-gold-light);

}





.user-action-btn.danger {

    background: var(--va-danger-soft);

    color: var(--va-danger);

    border-color: rgba(228,92,92,0.25);

}





/* =========================================================
   TRANSACTIONS TABLE
   ========================================================= */


.user-transactions {

    width: 100%;

    overflow-x: auto;

}



.user-transactions table {

    width: 100%;

    border-collapse: collapse;

}



.user-transactions th {

    padding: 12px;

    text-align: right;

    color: var(--va-text-muted);

    font-size: 11px;

    font-weight: 700;

    border-bottom:

        1px solid var(--va-border);

}



.user-transactions td {

    padding: 14px 12px;

    color: var(--va-text-soft);

    font-size: 12px;

    border-bottom:

        1px solid var(--va-border);

}



.user-transactions tr:last-child td {

    border-bottom: 0;

}





/* =========================================================
   ACTIVITY TIMELINE
   ========================================================= */


.user-timeline {

    display: flex;

    flex-direction: column;

    gap: 16px;

}



.user-timeline-item {

    position: relative;

    display: flex;

    gap: 12px;

}



.user-timeline-dot {

    width: 10px;

    height: 10px;

    flex: 0 0 10px;

    margin
   /* =========================================================
   RESPONSIVE
   ========================================================= */


@media (max-width: 1100px) {


    .user-info-grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

    }


    .user-details-grid {

        grid-template-columns:
            minmax(0, 1fr);

    }


}





@media (max-width: 768px) {


    .user-details-header {

        flex-direction: column;

        align-items: stretch;

        gap: 12px;

    }



    .user-details-title {

        font-size: 22px;

    }



    .user-profile-card {

        flex-direction: column;

        align-items: flex-start;

        text-align: right;

    }



    .user-profile-avatar {

        width: 60px;

        height: 60px;

        flex-basis: 60px;

        font-size: 22px;

    }



    .user-info-grid {

        grid-template-columns:

            minmax(0, 1fr);

    }



    .user-balance-box {

        flex-direction: column;

        align-items: flex-start;

    }



    .user-balance-value {

        font-size: 24px;

    }



    .user-details-card-body {

        padding: 16px;

    }



    .user-data-row {

        flex-direction: column;

        align-items: flex-start;

        gap: 6px;

    }



    .user-actions {

        width: 100%;

    }



    .user-action-btn {

        width: 100%;

    }


}





@media (max-width: 420px) {


    .user-profile-name {

        font-size: 17px;

    }



    .user-details-card-header {

        padding: 15px;

    }



    .user-details-card-body {

        padding: 14px;

    }



           }
